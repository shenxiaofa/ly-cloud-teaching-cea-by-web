#基础镜像  
FROM registry.ly-sky.com:5000/library/lycea-ui-nginx:latest  
   
#维护人信息  
MAINTAINER YuTianLong yutianlong@ly-sky.com  

ADD cea-manage.tar.gz /usr/local/nginx/html/
COPY nginx.conf /etc/nginx/nginx.conf

#暴露端口  
EXPOSE 80
   
#连接时执行的命令  
CMD ["nginx", "-g", "daemon off; load_module /etc/nginx/modules/ngx_http_perl_module.so;"]