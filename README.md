# 牛来一下

一个轻量的网页玩具站：点一下按钮或手绘牛，随机播放用户提供视频中的声音，并记录本地召唤次数。

## 素材说明

- 黑白简笔画牛来形象：页面使用透明背景的 `public/images/niulai-sketch-transparent.png`。
- 点击音效：`public/sounds/video-call-1.mp3`、`video-call-2.mp3`、`video-call-3.mp3`，分别从用户提供的 `1.mp4`、`2.mp4`、`3.mp4` 提取。中文和英文页面共用这三段音效，每次点击随机播放一段。
- 备用牛叫声：`public/sounds/cow-moos-cc0.mp3`，来源 BigSoundBank Cow Moos #1，CC0 public domain。

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
