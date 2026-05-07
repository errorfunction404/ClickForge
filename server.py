import hashlib
import hmac
import json
import mimetypes
import os
import re
import secrets
import sqlite3
import time
from datetime import datetime, timezone
from http import cookies
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse


BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "clickforge.db"
MAX_BODY = 12 * 1024 * 1024
SESSION_SECONDS = 60 * 60 * 24 * 30
ALLOWED_STATIC = {".html", ".css", ".js", ".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico", ".webp"}


def now_iso():
  return datetime.now(timezone.utc).isoformat()


def connect_db():
  conn = sqlite3.connect(DB_PATH)
  conn.row_factory = sqlite3.Row
  return conn


def init_db():
  with connect_db() as conn:
    conn.execute("""
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL COLLATE NOCASE UNIQUE,
        password_hash TEXT NOT NULL,
        salt TEXT NOT NULL,
        created_at TEXT NOT NULL,
        last_login TEXT
      )
    """)
    conn.execute("""
      CREATE TABLE IF NOT EXISTS sessions (
        token TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        created_at INTEGER NOT NULL,
        expires_at INTEGER NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    """)
    conn.execute("""
      CREATE TABLE IF NOT EXISTS saves (
        user_id INTEGER PRIMARY KEY,
        save_data TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    """)
    conn.commit()


def hash_password(password, salt=None):
  password_text = str(password)
  salt_value = salt or secrets.token_hex(16)
  digest = hashlib.pbkdf2_hmac("sha256", password_text.encode("utf-8"), bytes.fromhex(salt_value), 180000)
  return salt_value, digest.hex()


def valid_username(username):
  return bool(username) and len(username) <= 32 and re.fullmatch(r"[A-Za-z0-9_.-]+", username) is not None


def create_session(conn, user_id):
  token = secrets.token_urlsafe(32)
  created = int(time.time())
  expires = created + SESSION_SECONDS
  conn.execute("INSERT INTO sessions (token, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)", (token, user_id, created, expires))
  conn.commit()
  return token


def cleanup_sessions(conn):
  conn.execute("DELETE FROM sessions WHERE expires_at < ?", (int(time.time()),))
  conn.commit()


def save_for_user(conn, user_id):
  row = conn.execute("SELECT save_data FROM saves WHERE user_id = ?", (user_id,)).fetchone()
  if not row:
    return None
  try:
    return json.loads(row["save_data"])
  except json.JSONDecodeError:
    return None


class ClickForgeHandler(BaseHTTPRequestHandler):
  server_version = "ClickForge/1.0"

  def do_OPTIONS(self):
    self.send_response(204)
    self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    self.send_header("Access-Control-Allow-Headers", "Content-Type")
    self.end_headers()

  def do_GET(self):
    path = urlparse(self.path).path
    if path == "/api/session":
      self.handle_session()
      return
    if path == "/api/save":
      self.handle_get_save()
      return
    self.serve_static(path)

  def do_POST(self):
    path = urlparse(self.path).path
    if path == "/api/register":
      self.handle_register()
      return
    if path == "/api/login":
      self.handle_login()
      return
    if path == "/api/logout":
      self.handle_logout()
      return
    if path == "/api/save":
      self.handle_post_save()
      return
    self.send_json(404, {"ok": False, "message": "Route not found."})

  def read_json(self):
    length = int(self.headers.get("Content-Length", "0") or "0")
    if length > MAX_BODY:
      self.send_json(413, {"ok": False, "message": "Request is too large."})
      return None
    raw = self.rfile.read(length) if length else b"{}"
    if not raw:
      return {}
    try:
      return json.loads(raw.decode("utf-8"))
    except json.JSONDecodeError:
      self.send_json(400, {"ok": False, "message": "Invalid JSON."})
      return None

  def send_json(self, status, payload, extra_headers=None):
    body = json.dumps(payload).encode("utf-8")
    self.send_response(status)
    self.send_header("Content-Type", "application/json; charset=utf-8")
    self.send_header("Content-Length", str(len(body)))
    self.send_header("Cache-Control", "no-store")
    if extra_headers:
      for key, value in extra_headers.items():
        self.send_header(key, value)
    self.end_headers()
    self.wfile.write(body)

  def session_cookie(self, token):
    return f"cf_session={token}; Path=/; Max-Age={SESSION_SECONDS}; HttpOnly; SameSite=Lax"

  def clear_cookie(self):
    return "cf_session=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax"

  def cookie_token(self):
    raw = self.headers.get("Cookie", "")
    jar = cookies.SimpleCookie()
    try:
      jar.load(raw)
    except cookies.CookieError:
      return None
    morsel = jar.get("cf_session")
    return morsel.value if morsel else None

  def current_user(self, conn):
    token = self.cookie_token()
    if not token:
      return None
    cleanup_sessions(conn)
    row = conn.execute("""
      SELECT users.id, users.username, sessions.token
      FROM sessions
      JOIN users ON users.id = sessions.user_id
      WHERE sessions.token = ? AND sessions.expires_at >= ?
    """, (token, int(time.time()))).fetchone()
    return row

  def require_user(self, conn):
    user = self.current_user(conn)
    if not user:
      self.send_json(401, {"ok": False, "message": "Not signed in."})
      return None
    return user

  def user_payload(self, user):
    return {"username": user["username"]}

  def handle_register(self):
    data = self.read_json()
    if data is None:
      return
    username = str(data.get("username", "")).strip()
    password = str(data.get("password", ""))
    if not valid_username(username):
      self.send_json(400, {"ok": False, "message": "Use letters, numbers, dots, dashes, or underscores for the username."})
      return
    if not password:
      self.send_json(400, {"ok": False, "message": "Create a password."})
      return
    salt, digest = hash_password(password)
    with connect_db() as conn:
      existing = conn.execute("SELECT id FROM users WHERE username = ? COLLATE NOCASE", (username,)).fetchone()
      if existing:
        self.send_json(409, {"ok": False, "message": "Username already taken."})
        return
      try:
        cursor = conn.execute(
          "INSERT INTO users (username, password_hash, salt, created_at) VALUES (?, ?, ?, ?)",
          (username, digest, salt, now_iso())
        )
        user_id = cursor.lastrowid
        token = create_session(conn, user_id)
        user = conn.execute("SELECT id, username FROM users WHERE id = ?", (user_id,)).fetchone()
      except sqlite3.IntegrityError:
        self.send_json(409, {"ok": False, "message": "Username already taken."})
        return
    self.send_json(201, {"ok": True, "user": self.user_payload(user), "saveData": None}, {"Set-Cookie": self.session_cookie(token)})

  def handle_login(self):
    data = self.read_json()
    if data is None:
      return
    username = str(data.get("username", "")).strip()
    password = str(data.get("password", ""))
    with connect_db() as conn:
      user = conn.execute("SELECT * FROM users WHERE username = ? COLLATE NOCASE", (username,)).fetchone()
      if not user:
        self.send_json(401, {"ok": False, "message": "Username or password is incorrect."})
        return
      _, digest = hash_password(password, user["salt"])
      if not hmac.compare_digest(digest, user["password_hash"]):
        self.send_json(401, {"ok": False, "message": "Username or password is incorrect."})
        return
      conn.execute("UPDATE users SET last_login = ? WHERE id = ?", (now_iso(), user["id"]))
      token = create_session(conn, user["id"])
      save_data = save_for_user(conn, user["id"])
    self.send_json(200, {"ok": True, "user": self.user_payload(user), "saveData": save_data}, {"Set-Cookie": self.session_cookie(token)})

  def handle_logout(self):
    token = self.cookie_token()
    if token:
      with connect_db() as conn:
        conn.execute("DELETE FROM sessions WHERE token = ?", (token,))
        conn.commit()
    self.send_json(200, {"ok": True}, {"Set-Cookie": self.clear_cookie()})

  def handle_session(self):
    with connect_db() as conn:
      user = self.require_user(conn)
      if not user:
        return
      save_data = save_for_user(conn, user["id"])
    self.send_json(200, {"ok": True, "user": self.user_payload(user), "saveData": save_data})

  def handle_get_save(self):
    with connect_db() as conn:
      user = self.require_user(conn)
      if not user:
        return
      save_data = save_for_user(conn, user["id"])
    self.send_json(200, {"ok": True, "saveData": save_data})

  def handle_post_save(self):
    data = self.read_json()
    if data is None:
      return
    with connect_db() as conn:
      user = self.require_user(conn)
      if not user:
        return
      save_data = data.get("saveData", {})
      packed = json.dumps(save_data, separators=(",", ":"))
      conn.execute(
        "INSERT OR REPLACE INTO saves (user_id, save_data, updated_at) VALUES (?, ?, ?)",
        (user["id"], packed, now_iso())
      )
      conn.commit()
    self.send_json(200, {"ok": True})

  def serve_static(self, path):
    if path == "/":
      path = "/index.html"
    relative = Path(unquote(path).lstrip("/"))
    target = (BASE_DIR / relative).resolve()
    if BASE_DIR not in target.parents and target != BASE_DIR:
      self.send_error(404)
      return
    if not target.is_file() or target.suffix.lower() not in ALLOWED_STATIC:
      self.send_error(404)
      return
    content_type = mimetypes.guess_type(str(target))[0] or "application/octet-stream"
    body = target.read_bytes()
    self.send_response(200)
    self.send_header("Content-Type", content_type)
    self.send_header("Content-Length", str(len(body)))
    self.send_header("Cache-Control", "no-store")
    self.end_headers()
    self.wfile.write(body)

  def log_message(self, format, *args):
    print(f"{self.address_string()} - {format % args}")


def main():
  init_db()
  port = int(os.environ.get("PORT", "8000"))
  server = ThreadingHTTPServer(("127.0.0.1", port), ClickForgeHandler)
  print(f"ClickForge is running at http://127.0.0.1:{port}")
  print(f"Database: {DB_PATH}")
  server.serve_forever()


if __name__ == "__main__":
  main()
