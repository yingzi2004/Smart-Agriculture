# ==========================================
# 智慧农业管理系统 Docker 镜像
# ==========================================
FROM eclipse-temurin:8-jre

# 设置时区
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 创建工作目录
RUN mkdir -p /app
WORKDIR /app

# 复制已打包的 jar
COPY ruoyi-admin/target/ruoyi-admin.jar /app/ruoyi-admin.jar

# 暴露端口
EXPOSE 8080

# 启动应用，数据库连接通过 docker-compose 的 command 传入
ENTRYPOINT ["java", "-Duser.timezone=Asia/Shanghai", "-Xms512m", "-Xmx1024m", "-jar", "/app/ruoyi-admin.jar"]
