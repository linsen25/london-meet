# 活动发布与互评系统 | Activity Release & Mutual Review System
基于SpringBoot + Vue的前后端分离活动发布、报名、互动、通知与双向评价系统
Full-stack separated system developed with SpringBoot and Vue, supporting activity release, participation, interaction, notification and mutual evaluation

---

## 项目介绍 | Project Introduction
本系统实现活动发起者与参与者之间的完整业务闭环，用户可注册登录、发布删除活动、报名参与、评论回复、收藏活动并接收消息通知。活动结束后双方可进行多维度双向评分，活动一经发布不可编辑，仅支持删除重发，保障数据真实可靠。
This system builds a complete business loop between activity organizers and participants. Users can register, log in, publish and delete activities, sign up, comment, collect activities and receive notifications. Two-way multi-dimensional scoring is available after activities end. Published activities cannot be edited, only deleted and recreated to guarantee data authenticity.

---

## 核心功能 | Core Functions
- 用户注册登录、个人信息管理 | User registration, login and personal information management
- 活动帖子发布、查阅与删除 | Activity post creation, viewing and deletion
- 活动报名、取消报名与到场签到 | Activity sign-up, cancellation and check-in
- 帖子评论及二级回复互动 | Post comment and secondary reply interaction
- 活动收藏与取消收藏操作 | Activity collection and uncollection
- 多类型消息推送与通知查看 | Multiple types of message push and notification check
- 参与者与发起者双向多维评价 | Two-way multi-dimensional evaluation between participants and organizers
- 活动状态分类管控 | Classification and management of activity status

---

## 技术栈 | Technology Stack
### 后端 Backend
- Java 8+
- Spring Boot、Spring MVC
- Spring Security 权限控制 | Permission control
- MyBatis / MyBatis-Plus 数据持久层 | Data persistence framework
- MySQL 关系型数据库 | Relational database
- Redis 缓存服务 | Cache service for hot data and unread messages
- Maven 项目构建工具 | Project build tool

### 前端 Frontend
- Vue.js 3 核心框架 | Core framework
- Vue Router 路由管理 | Route management
- Axios 网络请求 | Network request
- Element Plus UI组件库 | UI component library
- 前后端分离架构 | Front-end and back-end separation architecture

---

## 系统完整实体类 | All Entity Classes
### 1. 用户类 User
- - id : int  用户编号
- - username : String  登录账号
- - password : String  登录密码
- - nickname : String  昵称
- - phone : String  联系电话
- - avatar : String  头像地址
- - createdAt : Date  注册时间

### 2. 活动帖子类 Activity
- - id : int  活动编号
- - title : String  活动标题
- - content : String  活动详情
- - startTime : Date  开始时间
- - endTime : Date  结束时间
- - location : String  活动地点
- - organizerId : int  发起人ID
- - status : String  活动状态
- - createdAt : Date  发布时间

### 3. 活动报名类 ActivitySignUp
- - id : int  报名编号
- - activityId : int  关联活动ID
- - userId : int  报名用户ID
- - status : String  报名状态
- - createdAt : Date  报名时间

### 4. 评论类 Comment
- - id : int  评论编号
- - activityId : int  所属活动ID
- - userId : int  评论用户ID
- - content : String  评论内容
- - createdAt : Date  评论时间

### 5. 评论回复类 CommentReply
- - id : int  回复编号
- - commentId : int  上级评论ID
- - userId : int  回复发起用户ID
- - replyUserId : int  被回复用户ID
- - content : String  回复内容
- - createdAt : Date  回复时间

### 6. 活动收藏类 Collection
- - id : int  收藏编号
- - userId : int  收藏用户ID
- - activityId : int  收藏活动ID
- - createdAt : Date  收藏时间

### 7. 消息通知类 Notification
- - id : int  通知编号
- - fromUserId : int  消息发送方ID
- - toUserId : int  消息接收方ID
- - activityId : int  关联活动ID
- - title : String  通知标题
- - content : String  通知详情
- - type : String  通知类型
- - isRead : int  已读标记
- - createdAt : Date  生成时间

### 8. 参与者评价发起者 UserRateOrganizer
- - id : int  评价编号
- - userId : int  评价人ID
- - activityId : int  对应活动ID
- - organizerId : int  被评价发起人ID
- - serviceScore : int  服务体验评分
- - arrangeScore : int  活动安排评分
- - punctualScore : int  守时表现评分
- - comment : String  评价文字
- - createTime : Date  评价时间

### 9. 发起者评价参与者 OrganizerRateUser
- - id : int  评价编号
- - userId : int  评价发起人ID
- - activityId : int  对应活动ID
- - participantId : int  被评价参与者ID
- - punctualScore : int  个人守时评分
- - abideScore : int  规则遵守评分
- - cooperateScore : int  团队协作评分
- - comment : String  评价文字
- - createTime : Date  评价时间

---

## 评价维度说明 | Evaluation Dimension Description
### 参与者评价发起者 Participant to Organizer
- 服务体验：判断参与过程是否受到冷落 | Service experience: judge whether feeling neglected during participation
- 活动安排：评判整体流程规划合理性 | Activity arrangement: evaluate rationality of overall process planning
- 守时表现：考核发起人是否遵守约定时间 | Punctuality: check if organizer follows scheduled time

### 发起者评价参与者 Organizer to Participant
- 个人守时：核查参与者到场时间是否准时 | Personal punctuality: check arrival time of participants
- 规则遵守：判定是否服从活动各项规定 | Rule compliance: judge obedience to activity regulations
- 团队协作：衡量用户配合团队活动的程度 | Team cooperation: measure teamwork engagement level

---

## 项目特点 | Project Features
- 采用前后端分离架构，代码解耦便于迭代维护 | Adopt separated architecture, decoupled code for easy maintenance and iteration
- 活动禁止编辑修改，仅可删除重发，保障信息严谨性 | No editable activities, only deletion and recreation to ensure information accuracy
- 搭建完整双向评分机制，多维度客观评估用户表现 | Complete two-way scoring system for objective multi-dimensional user assessment
- 覆盖报名、评论、收藏、通知全套社交互动场景 | Cover full social scenarios including sign-up, comment, collection and notification
- 引入Redis缓存优化查询效率，提升系统响应速度 | Apply Redis cache to optimize query efficiency and system response speed
- 集成权限管控机制，规范用户各项操作行为 | Integrate permission control to standardize user operations

---

## 作者 | Author
Linsen Liu