# 项目路线图 | Project Roadmap

## 1. 需求分析与模型设计 | Requirements Analysis & Model Design
- 梳理整体业务逻辑，敲定全部实体类结构
- 绘制用户业务流程图、系统活动图
- 完成类图基础框架绘制，剩余细节后续补充完善
- 敲定数据表结构、实体关联关系
- 统一前后端接口交互规范

- Sort out overall business logic and confirm all entity structures
- Draw user business flow chart and system activity diagram
- Complete basic frame of class diagram, leave details to be supplemented later
- Confirm data table structure and entity correlation
- Unify interaction specifications of front and back end interfaces

## 2. 开发环境搭建 | Development Environment Construction
- 搭建Spring Boot后端工程，整合Maven、MyBatis框架
- 初始化Vue3前端项目，配置路由、网络请求与UI组件库
- 完成MySQL数据库、Redis缓存服务部署配置
- 封装全局异常处理、统一数据返回格式、基础权限校验模块

- Build Spring Boot backend project, integrate Maven and MyBatis
- Initialize Vue3 front-end project, configure route, request and UI library
- Deploy and configure MySQL database and Redis cache service
- Encapsulate global exception handling, unified response format and basic permission verification

## 3. 基础模块开发 | Basic Module Development
- 实现用户注册、登录、个人信息维护功能
- 开发活动发布、查询、删除基础功能
- 编写报名、收藏、评论回复基础业务接口
- 对应完成前端页面基础布局与页面跳转逻辑

- Realize user registration, login and personal information management
- Develop basic functions of activity release, query and deletion
- Write basic interfaces for sign-up, collection, comment and reply
- Complete basic page layout and page jump logic on front end

## 4. 核心业务开发 | Core Business Development
- 开发双向评分评价相关功能接口
- 实现消息通知推送、已读状态管理
- 接入Redis缓存，优化高频数据访问效率
- 完善个人中心各类数据展示与操作页面

- Develop interfaces for two-way scoring and evaluation
- Implement message push and read status management
- Access Redis cache to optimize access efficiency of frequent data
- Improve data display and operation pages in personal center

## 5. 功能调试与优化 | Function Debugging & Optimization
- 全流程遍历测试，校验各项业务运行逻辑
- 修复页面交互、数据传递存在的问题
- 优化页面样式、操作体验与系统响应速度
- 补全类图剩余绘制细节，规整各类设计图纸

- Test full process and verify all business logic
- Fix problems of page interaction and data transmission
- Optimize page style, operation experience and system response speed
- Supplement remaining details of class diagram and sort out all design drawings

## 6. 项目打包部署 | Project Packaging & Deployment
- 前后端项目分别打包编译
- 配置数据库、缓存服务线上运行环境
- 配置反向代理，完成项目上线部署
- 线上环境复测，保障稳定运行

- Compile and package front-end and back-end projects respectively
- Configure online operating environment of database and cache
- Set reverse proxy and finish online deployment
- Retest on online environment to ensure stable operation

## 7. 文档汇总交付 | Document Collection & Delivery
- 完善README、路线图等项目说明文档
- 整理流程图、活动图、类图等设计图纸
- 汇总数据库设计、接口说明资料
- 整合全部材料，完成项目最终交付

- Improve project documents including README and roadmap
- Sort out design drawings such as flow chart, activity diagram and class diagram
- Collect documents of database design and interface description
- Integrate all materials and finish final project delivery