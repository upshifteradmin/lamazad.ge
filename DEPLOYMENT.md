# 🚀 Production Deployment Guide: lamazad.ge on Ubuntu VPS

This guide provides exact terminal commands to deploy **lamazad.ge** to a clean Ubuntu 22.04 / 24.04 LTS VPS (Hetzner, DigitalOcean, Linode, AWS EC2).

---

## 1. Initial Server Setup & Firewall

Connect to your server via SSH:
```bash
ssh root@YOUR_SERVER_IP
```

Update system packages:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git ufw
```

Configure the UFW firewall to allow SSH, HTTP, and HTTPS:
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

---

## 2. Install Docker & Docker Compose V2

Run the official Docker installation script:
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Verify Docker version
docker --version
docker compose version
```

---

## 3. Clone Repository & Setup Environment

Navigate to `/var/www` or `/home` and clone your project:
```bash
sudo mkdir -p /var/www/lamazad
cd /var/www/lamazad
git clone <YOUR_GIT_REPO_URL> .

# Setup environment variables
cp .env.example .env
nano .env
```
> **Tip:** In `.env`, set a strong, random password for `POSTGRES_PASSWORD` and update `DATABASE_URL`.

---

## 4. Obtain Initial Let's Encrypt SSL Certificate

Before launching full Nginx with SSL certificates, generate the initial certificate for `lamazad.ge` and `www.lamazad.ge` using Certbot:

```bash
# 1. Create directory structure for certbot
mkdir -p certbot/conf certbot/www

# 2. Run standalone certbot to issue certificate (ensure port 80 is not currently used by Apache or host Nginx)
docker run -it --rm --name certbot \
  -p 80:80 \
  -v "$(pwd)/certbot/conf:/etc/letsencrypt" \
  -v "$(pwd)/certbot/www:/var/www/certbot" \
  certbot/certbot certonly --standalone \
  -d lamazad.ge -d www.lamazad.ge \
  --email info@lamazad.ge \
  --agree-tos \
  --no-eff-email
```

---

## 5. Build and Launch Containers

Now start the entire production stack (`Next.js Standalone` + `PostgreSQL 16` + `Nginx Reverse Proxy` + `Certbot Auto-Renewer`):

```bash
docker compose up -d --build
```

Check the status of running containers:
```bash
docker compose ps
```

View live logs:
```bash
docker compose logs -f web
docker compose logs -f nginx
```

---

## 6. Run Database Migrations (Prisma)

Once PostgreSQL is healthy, execute the Prisma migration inside the web container:
```bash
docker compose exec web npx prisma db push
```

---

## 7. Zero-Downtime Updates (CI/CD Deployment)

Whenever you push new updates to git, update the production server with:
```bash
cd /var/www/lamazad
git pull origin main
docker compose build web
docker compose up -d --no-deps web
```

---

## 8. Automatic SSL Renewal Verification

The `certbot` container in `docker-compose.yml` automatically tests and renews the SSL certificates every 12 days. You can test a dry-run renewal at any time:
```bash
docker compose run --rm certbot renew --dry-run
```

---

## 9. Performance & Health Check

- Test HTTPS response:
  ```bash
  curl -I https://lamazad.ge
  ```
- Memory usage inspection:
  ```bash
  docker stats --no-stream
  ```
  *(Typical footprint: Next.js Standalone ~60MB RAM, Postgres ~35MB RAM, Nginx ~12MB RAM — running efficiently even on a $4/mo VPS).*
