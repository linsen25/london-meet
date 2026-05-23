# 系统需求文档 | System Requirements Document

## 1. 项目概述 | Project Overview
本项目是一个活动发布与双向互评系统，用户可发布活动、报名参与、评论互动、收藏活动、接收通知，并在活动结束后进行参与者与发起者之间的多维度双向评价。活动发布后不可编辑，仅可删除重发，保证信息真实性。

This project is an activity release and mutual evaluation system. Users can post activities, sign up, comment, collect, receive notifications, and rate each other after activities. Published activities cannot be edited, only deleted to ensure authenticity.

---

## 2. 功能需求 | Functional Requirements

### 2.1 用户模块 | User Module
- 用户注册
- 用户登录
- 个人信息查看与修改
- 头像上传
- 密码修改

- User registration
- User login
- View & modify profile
- Avatar upload
- Password change

### 2.2 活动（帖子）模块 | Activity (Post) Module
- 发布活动（标题、内容、时间、地点）
- 查看活动列表
- 查看活动详情
- 删除自己发布的活动
- 活动状态管理（报名中 / 进行中 / 已结束）
- 不支持编辑活动

- Release activity
- View activity list
- View activity detail
- Delete own activities
- Activity status management
- No activity editing allowed

### 2.3 报名模块 | Sign-up Module
- 用户报名活动
- 取消报名
- 活动签到
- 查看报名列表

- Sign up for activities
- Cancel sign-up
- Check in
- View sign-up list

### 2.4 评论与回复模块 | Comment & Reply Module
- 发布评论
- 删除自己的评论
- 查看评论列表
- 回复他人评论
- 删除自己的回复
- 查看回复列表

- Post comments
- Delete own comments
- View comment list
- Reply to others' comments
- Delete own replies
- View reply list

### 2.5 收藏模块 | Collection Module
- 收藏活动
- 取消收藏
- 查看我的收藏

- Collect activities
- Uncollect activities
- View my collections

### 2.6 消息通知模块 | Notification Module
- 活动报名通知
- 评论与回复通知
- 互评通知
- 未读消息计数
- 标记已读

- Sign-up notifications
- Comment & reply notifications
- Evaluation notifications
- Unread message count
- Mark as read

### 2.7 双向评价模块 | Mutual Evaluation Module
#### 参与者评价发起者
- 服务态度评分
- 活动安排评分
- 守时情况评分
- 文字评价

#### 发起者评价参与者
- 守时评分
- 遵守规则评分
- 团队协作评分
- 文字评价

#### Participant to Organizer
- Service score
- Arrangement score
- Punctuality score
- Comment

#### Organizer to Participant
- Punctuality score
- Rule compliance score
- Team cooperation score
- Comment

---

## 3. 非功能需求 | Non-Functional Requirements

### 3.1 性能需求 | Performance
- 接口响应时间 < 500ms
- 支持 500+ 在线用户
- 列表页面使用 Redis 缓存加速

- Response time < 500ms
- Support 500+ online users
- Use Redis for list caching

### 3.2 安全性需求 | Security
- 用户密码加密存储
- 接口权限校验
- 防重复提交
- 数据越权访问控制

- Password encryption
- API permission check
- Anti-duplicate submission
- Data access control

### 3.3 易用性需求 | Usability
- 界面简洁清晰
- 操作流程简单
- 提示信息明确
- 移动端友好

- Simple UI
- Easy operation
- Clear messages
- Mobile friendly

### 3.4 可扩展性需求 | Scalability
- 前后端分离架构
- 模块化开发
- 便于后续功能扩展

- Separated architecture
- Modular development
- Easy to extend

---

## 4. 运行环境需求 | System Environment

### 后端 | Backend
- Java 8+
- Spring Boot
- MySQL 5.7+
- Redis
- Maven

### 前端 | Frontend
- Vue.js 3
- Element Plus
- Chrome / Edge 浏览器

### 服务器 | Server
- JDK 1.8+
- MySQL
- Redis
- Nginx

---

## 5. 业务规则 | Business Rules
- 活动发布后不可修改，只能删除重发
- 只有登录用户可以发布评论
- 用户只能删除自己发布的评论和回复
- 只有活动参与者才能评价发起者
- 只有发起者才能评价参与者
- 每个用户对同一个活动只能评价一次
- 未报名用户不能评价、不能签到
- 活动结束后才能进行互评

- Activities cannot be edited after release
- Only logged-in users can post comments
- Users can only delete their own comments & replies
- Only participants can rate organizers
- Only organizers can rate participants
- One evaluation per user per activity
- Unregistered users cannot evaluate
- Mutual evaluation allowed only after activity ends

---

## 6. 项目目标 | Project Goals
- 实现活动发布、参与、互动、评价完整闭环
- 提供稳定、流畅、易用的操作体验
- 保证数据安全与系统性能
- 完成前后端分离项目开发与部署

- Achieve complete activity & evaluation closed-loop
- Provide stable & smooth user experience
- Ensure data security & performance
- Complete development & deployment

---

## Author
Linsen Liu