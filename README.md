# 牛来一下

一个轻量的网页玩具站：点一下按钮或手绘牛，播放“牛来”风格的合成音效，并记录本地召唤次数。

## 本地运行

```bash
npm install
npm run dev
```

访问 `http://localhost:3050`。

## 生产运行

```bash
npm install
npm run build
npm run start
```

服务监听 `0.0.0.0:3050`，适合让 Nginx 反向代理到 `http://127.0.0.1:3050`。

## PM2 守护进程

```bash
npm install -g pm2
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

后续更新代码后执行：

```bash
npm install
npm run build
pm2 restart niulai
```

如果不用 PM2，也可以用 `systemd` 托管 `npm run start`。

## Nginx

参考配置在 `deploy/nginx-niulai.conf`。复制到服务器：

```bash
sudo cp deploy/nginx-niulai.conf /etc/nginx/sites-available/niulai
sudo ln -s /etc/nginx/sites-available/niulai /etc/nginx/sites-enabled/niulai
sudo nginx -t
sudo systemctl reload nginx
```

把配置里的 `niulai.example.com` 替换成你的真实域名，并用 Certbot 签发证书。

如果证书还没有签发，先只启用 80 端口配置，通过后再启用 443 配置，或使用：

```bash
sudo certbot --nginx -d niulai.example.com -d www.niulai.example.com
```
