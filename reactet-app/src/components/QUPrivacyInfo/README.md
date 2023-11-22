/*
 * @Author: huangying
 * @Date: 2019-01-04 16:26:52
 * @Last Modified by: huangying
 * @Last Modified time: 2019-01-04 16:51:04
 */


| 参数          | 类型   | 说明     | 是否必须 | 默认值 | 
| ------------ | ------ | -------- | -------- | ------ |
| isPhone     | boolean | 只有电话的时候传 | false    | false |
| className   | string | 样式类名 | false    | '' |
| defaultShow | ReactNode | 默认全部显示内容 |  false   | 无 |
| privacyShow | ReactNode | 隐藏时显示 | false | ****** | 
| unit        | string | 前面显示单位 | false | 

```
  <QUPrivacyInfo isPhone={true} defaultShow="1528184121" />  => 152****121

  <QUPrivacyInfo defaultShow="" />  => -
  
  <QUPrivacyInfo defaultShow="1528184121" />  => ******

  <QUPrivacyInfo defaultShow="1528184121" privacyShow="*****************" />  => *****************

```
