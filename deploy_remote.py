import os
import paramiko

HOST = '213.199.36.249'
PORT = 22
USER = 'root'
PASSWORD = '363658686'

LOCAL_DIR = r'C:\savers\youtube-mp3-api'
REMOTE_DIR = '/opt/youtube_mp3_api'
EXCLUDE_DIRS = ['node_modules', '.git', '.system_generated', 'public/downloads']

def run_cmd(ssh, cmd):
    print(f"Executing: {cmd}")
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode().strip()
    err = stderr.read().decode().strip()
    if out: print(out)
    if err: print(f"ERROR: {err}")

def upload_dir(sftp, local_dir, remote_dir):
    try:
        sftp.mkdir(remote_dir)
    except IOError:
        pass 
        
    for root, dirs, files in os.walk(local_dir):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS and not d.startswith('.')]
        
        rel_path = os.path.relpath(root, local_dir)
        if rel_path == '.':
            rem_path = remote_dir
        else:
            rem_path = f"{remote_dir}/{rel_path.replace(os.sep, '/')}"
            try:
                sftp.mkdir(rem_path)
            except IOError:
                pass
        
        for f in files:
            if f.endswith('.py') and f == 'deploy_remote.py':
                continue
            local_file = os.path.join(root, f)
            remote_file = f"{rem_path}/{f}"
            print(f"Uploading {local_file} -> {remote_file}")
            sftp.put(local_file, remote_file)

def main():
    print("Connecting to SSH...")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, port=PORT, username=USER, password=PASSWORD)
    
    # Setup Node.js and PM2 if missing
    print("Installing Node.js and PM2 if missing...")
    run_cmd(ssh, "curl -fsSL https://deb.nodesource.com/setup_20.x | bash -")
    run_cmd(ssh, "apt-get install -y nodejs npm ufw")
    run_cmd(ssh, "npm install -g pm2")
    
    # Setup directory
    print("Setting up directory...")
    run_cmd(ssh, f"mkdir -p {REMOTE_DIR}")
    
    # Upload files via SFTP
    print("Uploading files via SFTP...")
    sftp = ssh.open_sftp()
    upload_dir(sftp, LOCAL_DIR, REMOTE_DIR)
    sftp.close()
    
    # NPM Install
    print("Running npm install...")
    run_cmd(ssh, f"cd {REMOTE_DIR} && npm install --omit=dev")
    
    # Start with PM2
    print("Starting App with PM2...")
    run_cmd(ssh, f"cd {REMOTE_DIR} && pm2 stop yt-mp3-api || true")
    run_cmd(ssh, f"cd {REMOTE_DIR} && pm2 start index.js --name yt-mp3-api")
    run_cmd(ssh, "pm2 save")
    run_cmd(ssh, "pm2 startup systemd -u root --hp /root || true")
    
    # Configure Firewall
    print("Configuring Firewall for Port 3000...")
    run_cmd(ssh, "ufw allow 3000/tcp")
    
    print("\nDeployment Successful!")
    print(f"API is now accessible at http://{HOST}:3000/")
    
    ssh.close()

if __name__ == "__main__":
    main()
