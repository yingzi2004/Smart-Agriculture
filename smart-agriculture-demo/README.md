# 智慧农业管理系统 Demo

本项目基于若依单体版 `RuoYi Spring Boot 2` 搭建，用作智慧农业竞赛项目的最小后端 Demo。

当前阶段目标很简单：先把基础后台框架搭起来，改成智慧农业项目的文字，保留后端接口能力。暂时不开发真实业务功能，也不接入硬件。

## 当前已完成

- 基于若依 `springboot2` 分支搭建项目。
- 系统名称改为“智慧农业管理系统”。
- 默认端口改为 `8080`。
- 关闭若依“实例演示”菜单。
- 登录页、首页标题、系统介绍页改为智慧农业 Demo 文案。
- 新增智慧农业占位接口。
- SQL 初始化库名改为 `smart_agriculture_demo`。

## 暂时不做

- 不接真实传感器。
- 不做水泵、风机、继电器等硬件控制。
- 不做完整作物管理、环境数据、告警、农事任务等 CRUD 功能。
- 不接 AI 大模型和病虫害识别模型。

这些功能后续再逐步加。

## 已保留的后端接口

```text
GET /agriculture/api/health
GET /agriculture/api/info
GET /agriculture/api/overview
GET /agriculture/api/modules
```

这些接口目前只返回占位数据，用来证明后端接口骨架已经留好。

## 前端 Demo 页面

当前已经加入一组纯前端 mock 页面，数据写在 `static/agriculture/demo.js` 中，暂时不依赖后端业务接口。

```text
/agriculture/dashboard.html     首页总览
/agriculture/crops.html         种植管理
/agriculture/environment.html   环境数据
/agriculture/alarms.html        告警中心
/agriculture/tasks.html         农事任务
/agriculture/ai.html            AI 农业助手
/agriculture/disease.html       病虫害识别
/agriculture/trace.html         溯源管理
```

登录后台后，左侧菜单会出现“智慧农业”分组，可以从菜单进入这些页面。

## 运行方式

### 方式一：Docker Compose 一键部署（推荐 🐳）

> 别人电脑上只需安装 **Docker Desktop**，无需装 Java、Maven、MySQL。

```bash
# 1. 先打包 jar（首次需要，之后不用）
mvn -pl ruoyi-admin -am -DskipTests package

# 2. 一键启动（MySQL + 后端 同时启动）
docker compose up -d

# 3. 浏览器访问
# http://localhost:8080
# 账号：admin / admin123

# 停止
docker compose down

# 彻底清除（含数据库数据）
docker compose down -v
```

### 方式二：手动部署（开发调试用）

1. 启动 Demo 专用 MySQL：

```powershell
powershell -ExecutionPolicy Bypass -File .\bin\start-demo-mysql.ps1
```

这个 MySQL 跑在 `127.0.0.1:3307`，不会影响本机原来的 `MySQL80` 服务。

2. 如果是第一次启动，导入 SQL：

```sql
source sql/ry_20260319.sql;
source sql/quartz.sql;
```

也可以直接运行：

```powershell
mysql --host=127.0.0.1 --port=3307 --user=root --password=smart123456 --default-character-set=utf8mb4 -e "source sql/ry_20260319.sql"
mysql --host=127.0.0.1 --port=3307 --user=root --password=smart123456 --default-character-set=utf8mb4 smart_agriculture_demo -e "source sql/quartz.sql"
```

3. 数据库配置文件：

```text
ruoyi-admin/src/main/resources/application-druid.yml
```

默认连接信息：

```text
host: 127.0.0.1
port: 3307
username: root
password: smart123456
database: smart_agriculture_demo
```

4. 启动后端：

```bash
mvn -pl ruoyi-admin -am spring-boot:run
```

或者使用脚本启动已打包好的 jar：

```powershell
powershell -ExecutionPolicy Bypass -File .\bin\start-demo-backend.ps1
```

5. 浏览器访问：

```text
http://localhost:8080
```

默认账号：

```text
admin / admin123
```

停止 Demo 专用 MySQL：

```powershell
powershell -ExecutionPolicy Bypass -File .\bin\stop-demo-mysql.ps1
```

停止后端：

```powershell
powershell -ExecutionPolicy Bypass -File .\bin\stop-demo-backend.ps1
```

## 后续扩展方向

- 作物与种植批次接口。
- 环境数据模拟接口。
- 告警规则接口。
- 农事任务接口。
- AI 农业助手接口。
- 病虫害图片识别接口。
- 农产品溯源接口。

当前版本只做项目骨架，不做业务闭环。
