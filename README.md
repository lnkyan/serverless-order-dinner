# serverless-order-dinner
基于无服务架构做的钉钉点餐工具。用来发布和记录公司每天免费晚餐的点餐情况

- 语言是Node.js
- 数据存储在阿里云OSS对象存储（每月有免费额度）
- 部署在阿里云的函数计算（每月有免费额度）
- 推送到钉钉机器人API



## 部署方法
### 一、注册阿里云账号
可以使用淘宝账号登录

### 二、配置OSS对象存储
1. 创建一个`存储空间`，即`Bucket`，就近选择一个区域，其它保留默认配置即可
2. 访问OSS需要accessKeys。鼠标指向阿里云控制台右上角头像，就可以看到了。我们创建一对新的acessId和accessKey
3. 参考`src/lib/config.sample.js`的格式创建`src/lib/config.js`文件，填入OSS相关信息

### 三、配置Serverless函数计算
1. 安装依赖库
    ```bash
    yarn
    ```
2. 参考`.env.sample`的格式创建`.env`文件，填入fun的配置信息
    - 这里的`ACCOUNT_ID`是阿里云账号ID，可以参考[这里](https://help.aliyun.com/document_detail/52984.html)
    - `REGION`最好和OSS在一起，具体取值也可以参考上面的文章，就是服务地址第一个点之前的部分，如`cn-shanghai`
3. 部署（使用[fun](https://help.aliyun.com/document_detail/64204.html?spm=a2c4g.11186623.2.18.171a29e9SGzvWi)）
    ```bash
    yarn run deploy
    ```

### 四、配置钉钉机器人
1. 在钉钉群中添加`自定义`机器人
2. 把机器人的`webhook`地址复制下来，粘贴到`src/lib/config.js`文件中

### 五、配置域名
1. 如果服务只提供GET、POST请求的话，登录阿里云[函数计算](https://fc.console.aliyun.com)，在`服务-函数`页中找到刚刚上传的函数，点开函数切换到`触发器`Tab，就可以看到访问地址
2. 如果要访问html的话，阿里云为防止滥用（上面那个域名没有备案），会在下发html时的header中强制带上`Content-Disposition: attachment`的配置，在浏览器中就变成下载文件了。所以还需要配置自定义域名
3. 购买一个域名，完成备案，然后配置一条CNAME解析规则为`<账号id>.<region>.fc.aliyuncs.com`
4. 打开云函数的`自定义域名`页面，创建一条域名，路径可以写`/`
5. 通过这个新域名就可以正常访问服务了



## 调试方法
该项目在本地完整运行需要安装docker，再运行`fun local invoke <function_name>`

为方便调试，提供了普通的http入口
```bash
yarn
yarn run start
```
控制台会打印调试用的入口地址
    


## TODO
- [ ] 配置日志服务。现在无法查看线上的日志。在云函数中可以开通简单日志服务SLS，免费的
- [ ] ~~配置域名。懒得备案，先记录一下方法吧~~
- [ ] 建一个新的目录或用webpack来打包上传，解决现在把devDependencies打包进去的问题（代码包上限50M）
- [ ] 把oss访问、钉钉访问、html服务、点餐服务拆到不同的函数或服务中去



## 云函数配置过程记录
### 概念介绍
[官方文档](https://help.aliyun.com/document_detail/52895.html?spm=a2c4g.11186623.6.541.6ffb4e73MwXZso)。基本上所有知识都能在这里找到

- `应用` 阿里云里面的云函数中，`应用`是通过`ROS`一键编排建立起来的，支持查看总的统计数据，但是服务名和函数名不能改。我尝试修改了`ROS`编排脚本，创建成功后在`应用`中却并没有看到它。所以暂时不管了，反正`服务`里面也有统计数据
- `服务` 一个`服务`可以中可以包含多个`函数`，一个`函数`可以配置`http`、`定时`等触发方式。为了开发方便，这里并不会为每一个http接口都创建一个`函数`（创建函数就得去写配置文件），而是通过express扩展http入口，让一个函数能够提供多个接口。这里可以在阿里云新建一个应用，选`Webapp Todolist`（基于Express），参考它的代码  
    当然从云函数的理念上来说，业务逻辑和基础能力一定是要拆分到不同的服务或函数中去的。自己要对业务逻辑和基础服务做好层级划分
- `版本` 云函数发布了`版本`后，代码就不能再修改了，可以通过带版本号的URL去访问，具体规则[在此](https://help.aliyun.com/document_detail/71229.html?spm=a2c4g.11186623.6.650.183f7dc4i1XHRB#config)
- `环境` 云函数的[执行环境](https://help.aliyun.com/document_detail/59223.html?spm=a2c4g.11186623.6.557.3eba4e73KIBJ8Q)中，可以通过`process.env.FC_FUNC_CODE_PATH`获取到代码所在路径  
    云函数的代码部署后就无法下载了，在线编辑只能看到`template.yaml`配置中`Handler`项所指的那个文件。因此需要自己找个代码仓库
- `调试` 通过`fun local invoke <function name>`可以本地调试，但需要安装docker。阿里云有个`Alibaba Cloud Toolkit`插件，可以在IDE中管理云服务器，也可以运行云函数，但还是需要docker
    > 这个插件要加群获取，我是安装的[PyCharm](https://yq.aliyun.com/articles/692467?spm=a2c4e.11153940.0.0.41144a40JGmxE7)版，然后等它升级到新版的

### 建立项目过程
1. 全局安装[fun](https://help.aliyun.com/document_detail/64204.html?spm=a2c4g.11186623.2.18.171a29e9SGzvWi)
    ```bash
    yarn global add @alicloud/fun
    ```
    这里使用[命令行](https://help.aliyun.com/document_detail/51783.html?spm=a2c4g.11186623.6.554.5aa510f3hvu3hC#using-fun)创建的方式，而不是在[网页上](https://help.aliyun.com/document_detail/51783.html?spm=a2c4g.11186623.6.554.5aa510f3hvu3hC#using-console)创建的方式。以后部署更新的时候用命令行比较方便
2. 创建应用
    ```bash
    fun init -n serverless-demo
    ```
    选择`http-trigger-nodejs10`模板
3. 我们只是用免费额度做测试，所以需要修改根目录下的配置文件`template.yaml`。主要就是改改服务和函数的名字，再降低一下配置。[yaml配置文档](https://github.com/alibaba/funcraft/blob/master/docs/specs/2018-04-03-zh-cn.md)。不懂的话可以去网页上创建一个新函数，配置好后，在服务页切换到`服务配置`Tab，然后选`导出配置`，拿它的配置来参考
4. 在项目目录下建一个`.env`文件，配置`fun`的部署参数
    - 这里的`ACCOUNT_ID`是阿里云账号ID，可以参考[这里](https://help.aliyun.com/document_detail/52984.html)
    - `REGION`最好和OSS在一起，具体取值也可以参考上面的文章，就是服务地址第一个点之前的部分，如`cn-shanghai`
    - `ACCESS_KEY_ID`和`ACCESS_KEY_SECRET`使用子账号的。给子账号分配`AliyunFCFullAccess`（部署云函数）权限和`AliyunOSSFullAccess`（OSS访问）权限
5. `fun`默认打包`CodeUri`下的所有文件，通过`funignore`可以配置忽略名单。阿里云有些内置的[依赖库](https://help.aliyun.com/document_detail/58011.html?spm=a2c4g.11186623.2.13.e8c71570CfXBD2#using-modules)，我们开发过程中的`devDependencies`依赖，都是不用上传的。这里可能需要写一下专门的打包上传流程。如果是非常简单的项目，也可以直接把项目打包成zip去网页上上传
6. HTTP触发器要对外暴露所以认证方式是`anonymous`。需要防刷的话可以设置为`function`，每次访问都需要[签名](https://help.aliyun.com/document_detail/71229.html?spm=5176.8663048.function-trigger.1.48f73edcfaHDTG)

其它参考资料 [使用 Serverless 实现日志报警](https://juejin.im/post/5c9852ad6fb9a070ff3caefa)