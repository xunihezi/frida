
function LogPrint(log) {
    var theDate = new Date();
    var hour = theDate.getHours();
    var minute = theDate.getMinutes();
    var second = theDate.getSeconds();
    var mSecond = theDate.getMilliseconds();

    hour < 10 ? hour = "0" + hour : hour;
    minute < 10 ? minute = "0" + minute : minute;
    second < 10 ? second = "0" + second : second;
    mSecond < 10 ? mSecond = "00" + mSecond : mSecond < 100 ? mSecond = "0" + mSecond : mSecond;

    var time = hour + ":" + minute + ":" + second + ":" + mSecond;
    var threadid = Process.getCurrentThreadId();
    console.log("[" + time + "]" + "->threadid:" + threadid + "--" + log);
}
function printNativeStack(context,name){
    //Thread.backtrace返回值是包含调用栈信息的对象数组,而DebugSymbol.fromAddress将解析他们,每一条后面+\n
   var trace=Thread.backtrace(context,Backtracer.ACCURATE).map(DebugSymbol.fromAddress).join("\n");
  
     LogPrint("------start-------"+name+"--------");
     LogPrint(trace);
     LogPrint("------end-------"+name+"--------");
}

function printJavaStack(name) {
    Java.perform(function () {
        var Exception = Java.use("java.lang.Exception");
        var ins = Exception.$new("Exception");
        var straces = ins.getStackTrace();
        if (straces != undefined && straces != null) {
            var strace = straces.toString();
            var replaceStr = strace.replace(/,/g, " \n ");
            LogPrint("=============================" + name + " Stack strat=======================");
            LogPrint(replaceStr);
            LogPrint("=============================" + name + " Stack end======================= \n ");
            Exception.$dispose();
        }
    });
}

function printExtra(intent){
    var extras = intent.getExtras();
    if(extras==null){
        return;
    }
    var keys = extras.keySet().toArray();
    console.log("Extra-------------------------------------------------------------------------------------------------");
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i].toString();
        var value = extras.get(key);
        
        console.log("Extra key:", key, "value:", value);
    }
    console.log("ExtraEnd----------------------------------------------------------------------------------------------");
}



function checkObjectIsXXX(object,className){
    if (object.$className===className) {
      
        return true
    } 
    return true
}

function printPendingIntent(pendingIntent){
       
    
    console.log("someMethod called with PendingIntent");

    // 打印 PendingIntent 的详细信息
    if (pendingIntent !== null) {
       // var intent = Java.cast(pendingIntent.getIntent().overload('java.lang.String'), Java.use("android.content.Intent"));
        console.log("Action: " + pendingIntent.getAction());
        console.log("Data: " + pendingIntent.getDataString());
        console.log("Package: " + pendingIntent.getPackage());
        console.log("Component: " + pendingIntent.getComponent());
        console.log("Flags: " + pendingIntent.getFlags());
        console.log("Categories: " + JSON.stringify(pendingIntent.getCategories()));
        console.log("Extras: " + JSON.stringify(pendingIntent.getExtras()));
    } else {
        console.log("PendingIntent is null");
    }


}


function hook_hookPendingIntentConstruction(){
    PendingIntent.getActivity.overload('android.content.Context', 'int', 'android.content.Intent', 'int').implementation = function (context, requestCode, intent, flags) {
        console.log("PendingIntent.getActivity called");

        // 打印 Intent 的详细信息
        if (intent !== null) {
            console.log("Intent Action: " + intent.getAction());
            console.log("Intent Data: " + intent.getDataString());
            console.log("Intent Package: " + intent.getPackage());
            console.log("Intent Component: " + intent.getComponent());
            console.log("Intent Flags: " + intent.getFlags());
            console.log("Intent Categories: " + JSON.stringify(intent.getCategories()));
            console.log("Intent Extras: " + printExtra(intent));
        } else {
            console.log("Intent is null");
        }
       // printJavaStack();
        // 调用原始方法
        return this.getActivity(context, requestCode, intent, flags);
    };
}

function printPendingIntentSend(){
    var PendingIntent = Java.use("android.app.PendingIntent");

    // 没有参数的重载
    PendingIntent.send.overload().implementation = function () {
        console.log("PendingIntent.send1()  called (no parameters)");
        return this.send();
    };

    // 只有一个 int 参数的重载
    PendingIntent.send.overload('int').implementation = function (requestCode) {
        console.log("PendingIntent.send2() called with requestCode: " + requestCode);
        return this.send(requestCode);
    };

    // 具有 int, OnFinished, Handler 参数的重载
    PendingIntent.send.overload('int', 'android.app.PendingIntent$OnFinished', 'android.os.Handler').implementation = function (requestCode, onFinished, handler) {
        console.log("PendingIntent.send3() called with requestCode: " + requestCode);
        return this.send(requestCode, onFinished, handler);
    };

    // 具有 Context, int, Intent 参数的重载
    PendingIntent.send.overload('android.content.Context', 'int', 'android.content.Intent').implementation = function (context, requestCode, intent) {
        console.log("PendingIntent.send4() called with requestCode: " + requestCode + " and Intent: " + intent);
        return this.send(context, requestCode, intent);
    };

    // 具有 Context, int, Intent, OnFinished, Handler 参数的重载
    PendingIntent.send.overload('android.content.Context', 'int', 'android.content.Intent', 'android.app.PendingIntent$OnFinished', 'android.os.Handler').implementation = function (context, requestCode, intent, onFinished, handler) {
        console.log("PendingIntent.send5() called with requestCode: " + requestCode + " and Intent: " + intent);
        return this.send(context, requestCode, intent, onFinished, handler);
    };

    // 具有 Context, int, Intent, OnFinished, Handler, String 参数的重载
    PendingIntent.send.overload('android.content.Context', 'int', 'android.content.Intent', 'android.app.PendingIntent$OnFinished', 'android.os.Handler', 'java.lang.String').implementation = function (context, requestCode, intent, onFinished, handler, requiredPermission) {
        console.log("PendingIntent.send6() called with requestCode: " + requestCode + " and Intent: " + intent);
        return this.send(context, requestCode, intent, onFinished, handler, requiredPermission);
    };

    // 具有 Context, int, Intent, OnFinished, Handler, String, Bundle 参数的重载
    PendingIntent.send.overload('android.content.Context', 'int', 'android.content.Intent', 'android.app.PendingIntent$OnFinished', 'android.os.Handler', 'java.lang.String', 'android.os.Bundle').implementation = function (context, requestCode, intent, onFinished, handler, requiredPermission, options) {
        console.log("PendingIntent.send7() called with requestCode: " + requestCode + " and Intent: " + intent);
        return this.send(context, requestCode, intent, onFinished, handler, requiredPermission, options);
    };
}
function printHashMap(hashMap) {
    Java.perform(function () {
        var HashMap = Java.use('java.util.HashMap');

        // 确保 hashMap 被视为 HashMap 类型
        hashMap = Java.cast(hashMap, HashMap);

        // 调用 entrySet 方法
        var entrySet = hashMap.entrySet();
        var iterator = entrySet.iterator();

        // 遍历 HashMap
        while (iterator.hasNext()) {
            var entry = Java.cast(iterator.next(), Java.use('java.util.Map$Entry'));
            console.log('Key: ' + entry.getKey().toString() + ' - Value: ' + entry.getValue().toString());
        }
    });
}
function printMap(map){

    var result = "";
    var keys = map.keySet();
    var key_set = keys.iterator();
    LogPrint("----------------------------printMap Start----------------------------");
    while (key_set.hasNext()) {
        var key = key_set.next() ;
        var key_str = (key!=null) ? key.toString() : ""
        var value = map.get(key_str);
        var value_str = (value!=null) ? value.toString() : "";
        LogPrint(key + ": " + value);
        result+=key + ":" + value_str+";"
    }
    LogPrint("----------------------------printMap End!!----------------------------"+"\r\n");
}

function printLinkedHashMap(linkedHashMap) {
    // 确保linkedHashMap是一个有效的Java对象
    if (linkedHashMap === null || linkedHashMap === undefined) {
        console.log("Invalid LinkedHashMap object.");
        return;
    }

    // 获取LinkedHashMap的Set视图
    var entrySet = linkedHashMap.entrySet();
    var iterator = entrySet.iterator();

    console.log("LinkedHashMap contents:");

    // 遍历键值对
    while (iterator.hasNext()) {
        var entry = iterator.next();

        // 显式地将entry转换为Map.Entry类型
        var mapEntry = Java.cast(entry, Java.use("java.util.Map$Entry"));

        // 现在可以安全地调用getKey和getValue了
        var key = mapEntry.getKey().toString(); // 将键转换为字符串
        var value = mapEntry.getValue().toString(); // 将值转换为字符串

        console.log(key + " => " + value);
    }
}


function hook_Messager(){
    if (Java.available) {
        Java.perform(function () {
            var MessageClass = Java.use('android.os.Message');
    
            MessageClass.$init.overload().implementation = function () {
                var ret = this.$init.overload().call(this);
        
                if (this.what.value == 2) {
                    console.log("Message what = 2 : ", this.toString());
                }
                return ret;
            };
    
            // MessageClass.obtain.overload().implementation = function () {
            //     var ret = this.obtain.overload().call(this);
    
            //     if (this.what.value == 2) {
            //         console.log("Message what = 2 : ", this.toString());
            //     }
            //     return ret;
            // };
    
            MessageClass.obtain.overload('android.os.Handler').implementation = function (handler) {
                var ret = this.obtain.overload('android.os.Handler').call(this, handler);
           
                if (this.what.value == 2) {
                    console.log("Message what = 2 : ", this.toString());
                }
                return ret;
            };
    
            MessageClass.obtain.overload('android.os.Handler', 'int').implementation = function (handler, what) {
                var ret = this.obtain.overload('android.os.Handler', 'int').call(this, handler, what);
          
                if (this.what.value == 2) {
                    console.log("Message what = 2 : ", this.toString());
                }
                return ret;
            };
    
            MessageClass.obtain.overload('android.os.Handler', 'int', 'int','int').implementation = function (handler, what, arg1,arg2) {
                var ret = this.obtain.overload('android.os.Handler', 'int', 'int','int').call(handler, what, arg1,arg2);
          
                if (this.what.value == 2) {
                    console.log("Message what = 2 : ", this.toString());
                }
                return ret;
            };
    
            MessageClass.obtain.overload('android.os.Handler', 'int', 'java.lang.Object').implementation = function (handler, what, obj) {
                var ret = this.obtain.overload('android.os.Handler', 'int', 'java.lang.Object').call(this, handler, what, obj);
           
                if (this.what.value == 2) {
                    console.log("Message what = 2 : ", this.toString());
                }
                return ret;
            };
    
            MessageClass.obtain.overload('android.os.Handler', 'int', 'int', 'int').implementation = function (handler, what, arg1, arg2) {
                var ret = this.obtain.overload('android.os.Handler', 'int', 'int', 'int').call(this, handler, what, arg1, arg2);
          
                if (this.what.value == 2) {
                    console.log("Message what = 2 : ", this.toString());
                }
                return ret;
            };
    
            MessageClass.obtain.overload('android.os.Handler', 'int', 'int', 'int', 'java.lang.Object').implementation = function (handler, what, arg1, arg2, obj) {
                var ret = this.obtain.overload('android.os.Handler', 'int', 'int', 'int', 'java.lang.Object').call(this, handler, what, arg1, arg2, obj);
     
                if (this.what.value == 2) {
                    console.log("Message what = 2 : ", this.toString());
                }
                return ret;
            };
    
            MessageClass.obtain.overload('android.os.Message').implementation = function (orig) {
                var ret = this.obtain.overload('android.os.Message').call(this, orig);
       
                if (this.what.value == 2) {
                    console.log("Message what = 2 : ", this.toString());
                }
                return ret;
            };


            var Message = Java.use('android.os.Message');

            // Hook setWhat() 方法
            Message.setWhat.implementation = function (what) {
              if (what === 2) {
                console.log('Intercepting Message.what = 2 assignment');
                // 在这里添加你的自定义逻辑，例如阻止设置或修改字段值
                return; // 阻止设置
              }
          
              // 调用原始的 setWhat() 方法
              this.setWhat(what);
            };




            // var Handler = Java.use('android.os.Handler');
            // var Message = Java.use('android.os.Message');
          
            // // Hook sendMessage() 方法
            // Handler.sendMessage.implementation = function (msg) {
            //   var what = msg.what.value; // 获取 Message 的 what 字段值
            //   if (what === 2) {
            //     console.log('Intercepting Message.what == 2');
            //     // 在这里添加你的自定义逻辑，例如阻止消息的传递
            //     return; // 阻止消息传递
            //   }
          
            //   // 调用原始的 sendMessage() 方法
            //   this.sendMessage(msg);
            // };
        
        
        });
    } 
}









function get_ClickClass(){
    Java.perform(function () {
        // 获取View类
        var View = Java.use('android.view.View');
      
        // 拦截View类中的setOnClickListener方法
        View.setOnClickListener.implementation = function (listener) {
          // 如果listener为空，那么直接调用原来的setOnClickListener方法
          if (listener === null) {
            this.setOnClickListener(listener);
            return;
          }
      
          // 创建一个新的OnClickListener代理类
          var onClickListenerProxy = Java.use('android.view.View$OnClickListener');
          var proxy = Java.cast(listener, onClickListenerProxy);
      
          // 重载onClick方法
          onClickListenerProxy.onClick.implementation = function (v) {
            // 在这里添加你想要执行的代码，比如打印调用信息
            LogPrint("Click点击事件,当前类名=>"+this.$className);
            printJavaStack();
      
            // 调用原来的onClick方法
            proxy.onClick.call(listener, v);
          };
      
          // 调用原来的setOnClickListener方法，传入新的代理listener
          this.setOnClickListener(proxy);
        };





      });
}

function hook_All_Intent(){
    Java.perform(function () {
        var Intent = Java.use('android.content.Intent');
    
        var Intent_constructor_1 = Intent.$init.overload();
        var Intent_constructor_2 = Intent.$init.overload('android.content.Intent');
        var Intent_constructor_3 = Intent.$init.overload('android.content.Context', 'java.lang.Class');
        var Intent_constructor_4 = Intent.$init.overload('java.lang.String');
        var Intent_constructor_5 = Intent.$init.overload('java.lang.String', 'android.net.Uri');
    
        // Hooking Intent()
        Intent_constructor_1.implementation = function () {
            LogPrint('[*] Intent() hooked 1: ');
            //printJavaStack();
            LogPrint("\n");
            return Intent_constructor_1.call(this);
        };
    
        // Hooking Intent(Intent o)
        Intent_constructor_2.implementation = function (o) {
            LogPrint('[*] Intent(Intent) hooked 2: ');
       
            LogPrint('- Intent:'+ o.toString());
            printJavaStack();
            LogPrint("\n");
           
            return Intent_constructor_2.call(this, o);
        };
    
        // Hooking Intent(Context packageContext, Class<?> cls)
        Intent_constructor_3.implementation = function (packageContext, cls) {
            LogPrint('[*] Intent(Context, Class) hooked 3: ');
            
            LogPrint('- Package context:'+ packageContext);
            LogPrint('- Class:'+cls.getName());
            //printJavaStack();
            LogPrint("\n");


            return Intent_constructor_3.call(this, packageContext, cls);
        };
    
        // Hooking Intent(String action)
        Intent_constructor_4.implementation = function (action) {
            LogPrint('[*] Intent(String) hooked 4: ');
            LogPrint('- Action:'+ action);
            LogPrint("\n");
           printJavaStack();
            return Intent_constructor_4.call(this, action);
        };
    
        // Hooking Intent(String action, Uri uri)
        Intent_constructor_5.implementation = function (action, uri) {
            LogPrint('[*] Intent(String, Uri) hooked 5:');
            LogPrint('- Action:'+ action);
            if(uri!=null){
                LogPrint('- Uri:'+ uri.toString());
            }
            
            //printJavaStack();
            LogPrint("\n");
            return Intent_constructor_5.call(this, action, uri);
        };
    });
}







function hook_All_ActivityLife(){
    Java.perform(function () {
        var Activity = Java.use('android.app.Activity');
        var Application = Java.use('android.app.Application');
      
        // 实现ActivityLifecycleCallbacks接口
        var ActivityLifecycleCallbacks = Java.registerClass({
          name: 'com.example.ActivityLifecycleCallbacks',
          implements: [Application.ActivityLifecycleCallbacks],
          methods: {
            onActivityCreated: function (activity, savedInstanceState) {
              LogPrint('Activity onActivityCreated:', activity.toString());
            },
            onActivityStarted: function (activity) {
                LogPrint('Activity onActivityStarted:', activity.toString());
            },
            onActivityResumed: function (activity) {
                LogPrint('Activity onActivityResumed:', activity.toString());
            },
            onActivityPaused: function (activity) {
                LogPrint('Activity onActivityPaused:', activity.toString());
            },
            onActivityStopped: function (activity) {
                LogPrint('Activity onActivityStopped:', activity.toString());
            },
            onActivitySaveInstanceState: function (activity, outState) {
                LogPrint('Activity onActivitySaveInstanceState:', activity.toString());
            },
            onActivityDestroyed: function (activity) {
                LogPrint('Activity onActivityDestroyed:', activity.toString());
            }
          }
        });
      
        // 获取当前应用的Application实例并注册ActivityLifecycleCallbacks
        Activity.attach.overload('android.app.ContextImpl', 'android.app.ActivityThread', 'android.app.Instrumentation', 'android.os.IBinder', 'int', 'android.app.Application', 'android.content.Intent', 'android.content.pm.ActivityInfo', 'java.lang.CharSequence', 'android.app.Activity', 'java.lang.String', 'java.lang.String', 'android.content.ComponentName', 'android.content.pm.ProviderInfoList').implementation = function (context, thread, instrumentation, token, ident, app, intent, info, title, parent, id, lastNonConfigurationInstances, config, comp, providers) {
          this.attach(context, thread, instrumentation, token, ident, app, intent, info, title, parent, id, lastNonConfigurationInstances, config, comp, providers);
      
          app.registerActivityLifecycleCallbacks(ActivityLifecycleCallbacks.$new());
        };
      });
}
function MyenumerateClassLoaders(mClassName){
    LogPrint("/****************enumerateClassLoaders Start!**********************/");
    Java.enumerateClassLoaders({
        onMatch: function (loader) {
            try {
                if (loader.findClass(mClassName)) {
                    //LogPrint(loader);
                    // var cls= Java.use("bl");
                    // console.log(cls.class.getDeclaredMethods())
                    //EnumMethod(loader);                   
                    Java.classFactory.loader = loader;      //切换classloader
                    
                    LogPrint("/*****************FindClassLoader!**********************/");
                    
                }
            } catch (error) {
    
            }
    
        }, onComplete: function () {
    
        }
        
    });
        
    LogPrint("/*****************enumerateClassLoaders End!!**********************/");
    return;
}

function hook_ActivitryLife_onInstrumentation(){


    Java.perform(function () {
      // 获取Instrumentation类
      var Instrumentation = Java.use('android.app.Instrumentation');
    
      // 重载callActivityOnCreate方法
      Instrumentation.callActivityOnCreate.overload('android.app.Activity', 'android.os.Bundle').implementation = function (activity, icicle) {
        LogPrint('生命周期=> onCreate: ' + activity);
        this.callActivityOnCreate(activity, icicle);
      };
    
      // 重载callActivityOnStart方法
      Instrumentation.callActivityOnStart.overload('android.app.Activity').implementation = function (activity) {
        LogPrint('生命周期=> onStart: ' + activity);
        this.callActivityOnStart(activity);
      };
    
      // 重载callActivityOnResume方法
      Instrumentation.callActivityOnResume.overload('android.app.Activity').implementation = function (activity) {
        LogPrint('生命周期=> onResume: ' + activity);
        this.callActivityOnResume(activity);
      };
    
      // 重载callActivityOnPause方法
      Instrumentation.callActivityOnPause.overload('android.app.Activity').implementation = function (activity) {
        LogPrint('生命周期=> onPause: ' + activity);
        this.callActivityOnPause(activity);
      };
    
      // 重载callActivityOnStop方法
      Instrumentation.callActivityOnStop.overload('android.app.Activity').implementation = function (activity) {
        LogPrint('生命周期=> onStop: ' + activity);
        this.callActivityOnStop(activity);
      };
    
      // 重载callActivityOnDestroy方法
      Instrumentation.callActivityOnDestroy.overload('android.app.Activity').implementation = function (activity) {
        LogPrint('生命周期=> onDestroy: ' + activity);
        this.callActivityOnDestroy(activity);
      };
    
    });
}

function Hook_startActivity(){
    Java.perform(function() {
        var activity_class = Java.use('android.app.Activity');
        var context_class = Java.use('android.content.Context');
        var intent_class = Java.use('android.content.Intent');
        
        // Hook methods in android.app.Activity
        activity_class.startActivity.overload('android.content.Intent').implementation = function(intent) {
            console.log("Activity.startActivity called with Intent:"+intent.toString());
            printExtra(intent);
            //printJavaStack();
            this.startActivity.overload('android.content.Intent').call(this, intent);
        };
        
        activity_class.startActivity.overload('android.content.Intent', 'android.os.Bundle').implementation = function(intent, bundle) {
            console.log("Activity.startActivity called with Intent and Bundle:"+intent.toString());
            printExtra(intent);
            this.startActivity.overload('android.content.Intent', 'android.os.Bundle').call(this, intent, bundle);
        };
        
        // Hook methods in android.content.Context
        context_class.startActivity.overload('android.content.Intent').implementation = function(intent) {
            console.log("Context.startActivity called with Intent:");
            console.log(intent.toString());
            this.startActivity.overload('android.content.Intent').call(this, intent);
        };
        
        context_class.startActivity.overload('android.content.Intent', 'android.os.Bundle').implementation = function(intent, bundle) {
            console.log("Context.startActivity called with Intent and Bundle:");
            console.log(intent.toString());
            this.startActivity.overload('android.content.Intent', 'android.os.Bundle').call(this, intent, bundle);
        };
    });
}


function Hook_startActivityForResult(){
    Java.perform(function () {
        var Activity = Java.use('android.app.Activity');
        var Intent = Java.use('android.content.Intent');
      
        // Hook startActivityForResult(Intent intent, int requestCode) 方法
        Activity.startActivityForResult.overload('android.content.Intent', 'int').implementation = function (mintent, requestCode) {
          LogPrint('startActivityForResult()1 called with requestCode: ' + requestCode);
          LogPrint('Intent details:');
          LogPrint('  Action: ' + mintent.getAction());
          LogPrint('  Component: ' + mintent.getComponent());
          LogPrint('  Data: ' + mintent.getData());
          LogPrint('  Extras: ' + mintent.getExtras());
          LogPrint("完整Intent=>>>"+mintent);
          LogPrint("getStringExtra=>"+mintent.getStringExtra("extra.accountName"));
            
          printExtra(mintent);
          //printJavaStack();

          // 调用原始方法
          return this.startActivityForResult(mintent, requestCode);
        };

        // Hook startActivityForResult('java.lang.String', 'android.content.Intent', 'int', 'android.os.Bundle') 方法
        Activity.startActivityForResult.overload('java.lang.String', 'android.content.Intent', 'int', 'android.os.Bundle').implementation = function (mString, intent,requestCode,options) {
            LogPrint('startActivityForResult()2 called with requestCode: ' + requestCode);
            LogPrint('Intent details:');
            LogPrint('  Action: ' + intent.getAction());
            LogPrint('  Component: ' + intent.getComponent());
            LogPrint('  Data: ' + intent.getData());
            LogPrint('  Extras: ' + intent.getExtras());
            LogPrint('  mString: ' +mString+"\n");
            // 调用原始方法
            return this.startActivityForResult(mString, intent,requestCode,options);
          };


      
       // Hook startActivityForResult(Intent intent, int requestCode, Bundle options) 方法   1会调到3
        Activity.startActivityForResult.overload('android.content.Intent', 'int', 'android.os.Bundle').implementation = function (intent, requestCode, options) {
          LogPrint('startActivityForResult()3 called with requestCode: ' + requestCode + ' and options: ' + options);
          LogPrint('Intent details:');
          LogPrint('  Action: ' + intent.getAction());
          LogPrint('  Component: ' + intent.getComponent());
          LogPrint('  Data: ' + intent.getData());
          LogPrint('  Extras: ' + intent.getExtras()+"\n");
          //printJavaStack();
          // 调用原始方法
          return this.startActivityForResult(intent, requestCode, options);
        };
      
      });
}


function hook_bindService(){
    Java.perform(function () {
        var ContextWrapper = Java.use('android.content.ContextWrapper');
    
        ContextWrapper.bindService.overload('android.content.Intent', 'android.content.ServiceConnection', 'int').implementation = function (intent, connection, flags) {
            console.log('[+] bindService called with Intent:', intent.toString());
            console.log('[+] Connection:', connection.$className);
            console.log('[+] Flags:', flags);
            printJavaStack();
            // Call the original implementation
            return this.bindService(intent, connection, flags);
        };
    
        ContextWrapper.bindService.overload('android.content.Intent', 'int', 'java.util.concurrent.Executor', 'android.content.ServiceConnection').implementation = function (intent, flags, executor, connection) {
            console.log('[+] bindService called with Intent:', intent.toString());
            console.log('[+] Connection:', connection.$className);
            console.log('[+] Flags:', flags);
            console.log('[+] Executor:', executor.toString());
            //printJavaStack();
            // Call the original implementation
            return this.bindService(intent, flags, executor, connection);
        };
    });
}

function Bytes2HexString(arrBytes) {
    var str = "";
    for (var i = 0; i < arrBytes.length; i++) {
        var tmp;
        var num = arrBytes[i];
        if (num < 0) {
            //此处填坑，当byte因为符合位导致数值为负时候，需要对数据进行处理
            tmp = (255 + num + 1).toString(16);
        } else {
            tmp = num.toString(16);
        }
        if (tmp.length == 1) {
            tmp = "0" + tmp;
        }
        str += tmp;
    }
    return str;
};


function replaceClassLoder(className){

    Java.enumerateClassLoaders({
        "onMatch": function(loader) {
          
            var origLoader = Java.classFactory.loader;
            try {
           
                Java.classFactory.loader = loader
                Java.classFactory.use(className);
            } catch (error) {
              
             
                Java.classFactory.loader = origLoader;
            }
        },
        "onComplete": function() {
          
        }
    });
}





function Is_Pip(){
    Java.perform(function () {
   
        var Activity = Java.use('android.app.Activity');
        var PictureInPictureParams = Java.use('android.app.PictureInPictureParams');


    
        Activity.enterPictureInPictureMode.overload('android.app.PictureInPictureParams').implementation = function (params) {
    
            LogPrint('使用PIP模式函数1!!!'+"Activty名=>>"+this.getClass().toString());
            var isInPipMode = this.isInPictureInPictureMode();
            console.log('Is the activity in PIP mode:', isInPipMode);
            //return false;
            var ret=this.enterPictureInPictureMode(params);
            LogPrint("参数params=>>"+params+ "返回值=>>"+ret);
            printJavaStack();
            return ret;
        };
      
    });
}




function hook_userLeave(){
    Java.perform(function () {
        var Activity = Java.use('android.app.Activity');
      
        // Hook performUserLeaving 方法
        Activity.performUserLeaving.implementation = function () {
          LogPrint('performUserLeaving() 被调用');
      
          // 调用原始的 performUserLeaving 方法
          return this.performUserLeaving.apply(this, arguments);
        };
      });
}

function hook_onMultiWindowModeChanged(){
    Java.perform(function () {
        var Activity = Java.use('android.app.Activity');
      
        // Hook onMultiWindowModeChanged 方法
        Activity.onMultiWindowModeChanged.implementation = function (isInMultiWindowMode) {
          LogPrint('onMultiWindowModeChanged() 被调用，状态：', isInMultiWindowMode);
      
          // 调用原始的 onMultiWindowModeChanged 方法
          return this.onMultiWindowModeChanged(isInMultiWindowMode);
        };
      });
}

function hook_deviceSupportsPictureInPictureMode(){
    Java.perform(function() {
        var ActivityRecord = Java.use("android.app.Activity");
    
            ActivityRecord.deviceSupportsPictureInPictureMode.implementation = function(caller, beforeStopping) {
               
                var result = this.deviceSupportsPictureInPictureMode();
                console.log("deviceSupportsPictureInPictureMode result:", result);
    
                return result;
            };

    });
}


function hook_onResume(){
    Java.perform(function() {
        var Activity = Java.use('android.app.Activity');
        var onWindowFocusChanged = Activity.onWindowFocusChanged;
    
        onWindowFocusChanged.implementation = function(hasFocus) {
            onWindowFocusChanged.call(this, hasFocus);
    
            var componentName = this.getComponentName().toString();
            
            // 检查是否是目标 Activity
            if (componentName === 'com.google.android.apps.youtube.app.watchwhile.WatchWhileActivity') {
                // 获取当前 Activity 的 Intent
                var intent = this.getIntent();
                
                // 获取并修改 flags
                var currentFlags = intent.getFlags();
                var newFlags = currentFlags | 0x14000000; // 添加所需的 flags
                intent.setFlags(newFlags);
                
                console.log("Activity onWindowFocusChanged() called, Flags modified:", currentFlags, "->", newFlags);
            }
        };
    });
}


function hook_Flg(){
    Java.perform(function () {
        var Intent = Java.use('android.content.Intent');
        var WatchWhileActivityName = 'com.google.android.apps.youtube.app.watchwhile.WatchWhileActivity';
    
        Intent.setFlags.implementation = function (flags) {
            if (this.getComponent() && this.getComponent().getClassName().toString() === WatchWhileActivityName) {
                console.log("Setting flags for " + WatchWhileActivityName + " to: 0x" + flags.toString(16));
                //printJavaStack();
            }
            return this.setFlags.call(this, flags);
        };
    
        Intent.getFlags.implementation = function () {
            var flags = this.getFlags.call(this);
            if (this.getComponent() && this.getComponent().getClassName().toString() === WatchWhileActivityName) {
                console.log("Getting flags for " + WatchWhileActivityName + ": 0x" + flags.toString(16));
                //printJavaStack();
            }
            return flags;
        };
    });
}




function hook_startActivityes(){
    Java.perform(function() {
        var Activity = Java.use('android.app.Activity');
      
        // Hook the first overload: startActivities(Intent[] intents)
        Activity.startActivities.overload('[Landroid.content.Intent;').implementation = function(intents) {
          console.log('startActivities called with Intent array');
          for (var i = 0; i < intents.length; i++) {
            console.log('Intent ' + (i + 1) + ': ' + intents[i]);
          }
          return this.startActivities.overload('[Landroid.content.Intent;').call(this, intents);
        };
      
        // Hook the second overload: startActivities(Intent[] intents, Bundle options)
        Activity.startActivities.overload('[Landroid.content.Intent;', 'android.os.Bundle').implementation = function(intents, options) {
          console.log('startActivities called with Intent array and Bundle options');
          for (var i = 0; i < intents.length; i++) {
            console.log('Intent ' + (i + 1) + ': ' + intents[i]);
          }
          console.log('Bundle options: ' + options);
          return this.startActivities.overload('[Landroid.content.Intent;', 'android.os.Bundle').call(this, intents, options);
        };
      });
}



function hook_addflg(){
    Java.perform(function () {
        var Intent = Java.use('android.content.Intent');
      
        Intent.addFlags.implementation = function (flags) {
          console.log('Intent.addFlags called with flag: ' + flags);
          
          // You can modify the flags here if needed
          // For example, to add FLAG_ACTIVITY_NEW_TASK: flags |= 0x10000000;
          
          return this.addFlags.call(this, flags);
        };
      });
}





function find_View_Click_ClassName(){
    Java.perform(function() {
        //android.view.View.peformClick
        var View = Java.use('android.view.View');
    
        View.performClick.implementation = function() {
            console.log('View.performClick() was called');
            
           console.log("View点击事件所属类名=>>>>>>"+JSON.stringify(this));
            return this.performClick.call(this);
        };

  
        //上面打印不出来 类名 可以用下面这个函数 在他设置监听器的时候看都设置了那些 然后逐一排查 需要注意时机
        // var View = Java.use('android.view.View');
        
        // View.setOnClickListener.implementation = function(listener) {
        //     if (listener !== null) {
        //         // 获取 listener 对象的类名
        //         var className = listener.$className;
        //         console.log("OnClickListener class name: " + className);
                
        //         // 如果你还想进一步获取这个 listener 对象的其他信息或方法，你也可以这样做
        //         // ...
        //     }
            
        //     return this.setOnClickListener.call(this, listener);
        // };
        
    })
}



function hookAllMethodsOfClass(className) {

    var targetClass;
    try {
        targetClass = Java.use(className);
    } catch (e) {
        console.error("[!] Cannot find class", className);
        return;
    }

    // 获取所有方法
    var declaredMethods = targetClass.class.getDeclaredMethods();
    declaredMethods.forEach(function(method) {
        // Extracting method name from full method description
        var methodName = method.getName();
        
        if (targetClass[methodName] && targetClass[methodName].overloads) {
            targetClass[methodName].overloads.forEach(function(overload) {
                try {
                    overload.implementation = function() {
                        console.log("[*] Called", className + "." + methodName);
                        
                        // 调用原始方法并获取结果
                        var result = overload.apply(this, arguments);
                        
                        console.log("[*] Result:", result+"\r\n");
                        printJavaStack();
                        return result;
                    };
                } catch (e) {
                    console.error("[!] Failed to hook", className + "." + methodName, e.message);
                }
            });
        }
    });

}

function hook_dlopen() {
    Interceptor.attach(Module.findExportByName(null, "android_dlopen_ext"),
        {
            onEnter: function (args) {
                var pathptr = args[0];
                if (pathptr !== undefined && pathptr != null) {
                    var path = ptr(pathptr).readCString();
                    console.log("load " + path);
                }
            }
        }
    );
}



function hook__system_property_get(){
        //32位so的系统函数 用来获取设备信息的 build prop
       Interceptor.attach(Module.findExportByName(null, "__system_property_get"), {
        onEnter: function(args) {
            this.key = Memory.readCString(args[0]);
            this.valuePtr = args[1]; // Save the pointer to the value buffer
        },
        onLeave: function(retval) {
            if (parseInt(retval) > 0) {
                var value = Memory.readCString(this.valuePtr); // Use the saved pointer
                console.log(`Key: ${this.key}, Value: ${value}, Length: ${retval}`);
            } else {
                console.log(`Key: ${this.key} has no value or is not set. retval=> `+parseInt(retval));
            }
        }
    });
}

function hook_RegisterNatives(addrRegisterNatives) {

    if (addrRegisterNatives != null) {
        Interceptor.attach(addrRegisterNatives, {
            onEnter: function (args) {
                console.log("[RegisterNatives] method_count:", args[3]);
                let java_class = args[1];
                let class_name = Java.vm.tryGetEnv().getClassName(java_class);
                //console.log(class_name);

                let methods_ptr = ptr(args[2]);

                let method_count = parseInt(args[3]);
                for (let i = 0; i < method_count; i++) {
                    let name_ptr = Memory.readPointer(methods_ptr.add(i * Process.pointerSize * 3));
                    let sig_ptr = Memory.readPointer(methods_ptr.add(i * Process.pointerSize * 3 + Process.pointerSize));
                    let fnPtr_ptr = Memory.readPointer(methods_ptr.add(i * Process.pointerSize * 3 + Process.pointerSize * 2));

                    let name = Memory.readCString(name_ptr);
                    let sig = Memory.readCString(sig_ptr);
                    let symbol = DebugSymbol.fromAddress(fnPtr_ptr)
                    let moduleBaseAddress = Module.findBaseAddress(symbol.moduleName);
                    let methodOffset_So= ptr(fnPtr_ptr).sub(moduleBaseAddress);
                    console.log("[RegisterNatives] java_class:", class_name, "name:", name, "sig:", sig, "fnPtr:", fnPtr_ptr,  " fnOffset:", symbol, " callee:", DebugSymbol.fromAddress(this.returnAddress)+" , methodOffset_So=> "+methodOffset_So);
                    console.log("函数地址"+symbol.address  +" ， 函数数据=>"+hexdump(symbol.address));
                }
            }
        });
    }
}
function find_RegisterNatives() {
    let symbols = Module.enumerateSymbolsSync("libart.so");
    let addrRegisterNatives = null;
    for (let i = 0; i < symbols.length; i++) {
        let symbol = symbols[i];
        
        //_ZN3art3JNI15RegisterNativesEP7_JNIEnvP7_jclassPK15JNINativeMethodi
        if (symbol.name.indexOf("art") >= 0 &&
                symbol.name.indexOf("JNI") >= 0 && 
                symbol.name.indexOf("RegisterNatives") >= 0 && 
                symbol.name.indexOf("CheckJNI") < 0) {
            addrRegisterNatives = symbol.address;
            console.log("RegisterNatives is at ", symbol.address, symbol.name);
            hook_RegisterNatives(addrRegisterNatives)
        }
    }

}

function Hook_LoadLibrary(){
    var LoadNativeLibrary=Module.findExportByName("libart.so","_ZN3art9JavaVMExt17LoadNativeLibraryEP7_JNIEnvRKNSt3__112basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEP8_jobjectP8_jstringPS9_");
    Interceptor.attach(LoadNativeLibrary,{
        onEnter:function(args){
            var string=args[2];
            //打印加载的so路径
            console.log("args3:",readStdString(string) );
        },onLeave:function (retval){

        }
    })
}
function printIntentFilter(intentFt) {
    var intentFilter = intentFt;  // 获取 IntentFilter 对象

    // 尝试获取并打印Action
    var count = intentFilter.countActions();
    if (count > 0) {
        for (var i = 0; i < count; i++) {
            var action = intentFilter.getAction(i);
            console.log("[*] Action found: " + action);
        }
    }
}

function hookSendOnPdIntetn(){
         // Hook PendingIntent的所有send方法重载版本
         var PendingIntent = Java.use("android.app.PendingIntent");
         var i=0;
         var overloads = PendingIntent.send.overloads;
         for (var i = 0; i < overloads.length; i++) {
             (function(overload) {
                 overload.implementation = function () {
                     var args = [];
                     for (var j = 0; j < arguments.length; j++) {
                         args.push(arguments[j]);
                     }
                     console.log("[*] PendingIntent.send() called with args: " + JSON.stringify(args));
                     printJavaStack();
                     // 调用原始方法
                     if(i==0){
                         i=1;
                     return overload.apply(this, arguments);
                    
                    }
                 };
             })(overloads[i]);
         }
}
function hookUrl(){
    var Uri = Java.use('android.net.Uri');
    Uri.parse.implementation = function(uriString) {
        
        console.log("Uri.parse() called with: " + uriString);
        printJavaStack();
        return this.parse(uriString);
    };
}

function hookKeyStoryAilas(){
    var Collections = Java.use('java.util.Collections');
    var Enumeration = Java.use('java.util.Enumeration');
    var InvocationHandler = Java.use('java.lang.reflect.InvocationHandler');
    var Proxy = Java.use('java.lang.reflect.Proxy');
    
    var originalEnumeration = Collections.enumeration.overload('java.util.Collection');
    
    Collections.enumeration.overload('java.util.Collection').implementation = function(collection) {
        var originalEnum = originalEnumeration.call(this, collection);
        
        // Create an InvocationHandler
        var handler = Java.registerClass({
            name: 'tech.openthos.EnumerationHandler',
            implements: [InvocationHandler],
            fields: {
                original: 'java.util.Enumeration'
            },
            methods: {
                invoke: {
                    returnType: 'java.lang.Object',
                    argumentTypes: ['java.lang.Object', 'java.lang.reflect.Method', '[Ljava.lang.Object;'],
                    implementation: function(proxy, method, args) {
                        var methodName = method.getName();
                        if (methodName === 'hasMoreElements') {
                            console.log("拦截返回false");
                            return Java.use('java.lang.Boolean').valueOf(false);

                        } else {
                            return method.invoke(this.original, args);
                        }
                    }
                }
            }
        }).$new();

        handler.original.value = originalEnum;
        
        var interfaces = [Enumeration.class];
        var proxyInstance = Proxy.newProxyInstance(Enumeration.class.getClassLoader(), interfaces, handler);
        return proxyInstance;
    };

}








//用于打印标准库std:string的函数
function readStdString(str){
    const isTiny=(str.readU8()&1)==0;
    if(isTiny){
        return str.add(1).readUtf8String();
    }
    return str.add(2*Process.pointerSize).readPointer().readUtf8String();
}


function Hook_LoadLibrary(){
    var LoadNativeLibrary=Module.findExportByName("libart.so","_ZN3art9JavaVMExt17LoadNativeLibraryEP7_JNIEnvRKNSt3__112basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEP8_jobjectP8_jstringPS9_");
    Interceptor.attach(LoadNativeLibrary,{
        onEnter:function(args){
            var string=args[2];
            //打印加载的so路径
            console.log("args3:",readStdString(string) );
        },onLeave:function (retval){

        }
    })
}

function stop(){
    var LoadedApk = Java.use('android.app.LoadedApk');
    LoadedApk.makeApplication.implementation = function (forceDefaultAppClass, instrumentation) {
        console.log("LoadedApk.makeApplication method called. Let's wait for debugger...");
        var result = this.makeApplication(forceDefaultAppClass, instrumentation);

        var NetworkSecurityConfigProvider = Java.use('android.security.net.config.NetworkSecurityConfigProvider');
        NetworkSecurityConfigProvider.handleNewApplication.implementation = function (appContext) {
            console.log("NetworkSecurityConfigProvider.handleNewApplication method called. Let's wait for debugger...");
            // Insert here the code to wait for debugger
            var Debug = Java.use('android.os.Debug');
            Debug.waitForDebugger();

            return this.handleNewApplication(appContext);
        };

        return result;
    };
}

function Obj2ClassName(obj){
    let objclass = Java.use("java.lang.Object");
    let p2class = Java.cast(obj,objclass)
    return p2class.getClass()
}







function MyGetFiled(thiz,className,fieldName,Log){
    // 获取 "fieldName" 字段的值，使用你的字段名替换 "fieldName"
    var field = Java.use("java.lang.Class").forName(className).getDeclaredField(fieldName);
    // var field = Java.use("com.google.android.apps.gsa.search.core.udc.k")
    // field.getDeclaredField("f");
    field.setAccessible(true);
    var fieldValue = field.get(thiz);
    //console.log("Field value: " + fieldValue.$className);
    //console.log(Log+"字段值=>"+fieldValue+"字段所属类"+ fieldValue.$className);
    return fieldValue;
}



function hook_File(){
    Java.perform(function () {
        var File = Java.use('java.io.File');
    
        File.$init.overload('java.lang.String').implementation = function (path) {
            console.log('File path: ' + path);
            printJavaStack();
            return this.$init(path);
        };
    
        File.$init.overload('java.lang.String', 'java.lang.String').implementation = function (parent, child) {
            console.log('File parent path: ' + parent + ', child path: ' + child);
            return this.$init(parent, child);
        };
    
        File.$init.overload('java.io.File', 'java.lang.String').implementation = function (dir, name) {
            console.log('File dir: ' + dir.toString() + ', name: ' + name);
            return this.$init(dir, name);
        };
    
        File.$init.overload('java.net.URI').implementation = function (uri) {
            console.log('File URI: ' + uri.toString());
            return this.$init(uri);
        };
    });
}

function hook_File_Open(){
    Java.perform(function () {
        var FileInputStream = Java.use('java.io.FileInputStream');
        var FileOutputStream = Java.use('java.io.FileOutputStream');
    
        // Hook FileInputStream
        FileInputStream.$init.overload('java.io.File').implementation = function (file) {
            console.log('FileInputStream opened: ' + file.getPath());
            return this.$init(file);
        };
    
        FileInputStream.$init.overload('java.io.FileDescriptor').implementation = function (fdObj) {
            console.log('FileInputStream opened with FileDescriptor: ' + fdObj.toString());
            return this.$init(fdObj);
        };
    
        FileInputStream.$init.overload('java.lang.String').implementation = function (path) {
            console.log('FileInputStream opened: ' + path);
            return this.$init(path);
        };
    
        // Hook FileOutputStream
        FileOutputStream.$init.overload('java.io.File').implementation = function (file) {
            console.log('FileOutputStream opened: ' + file.getPath());
            return this.$init(file);
        };
    
        FileOutputStream.$init.overload('java.io.File', 'boolean').implementation = function (file, append) {
            console.log('FileOutputStream (java.io.File', 'boolean)opened: ' + file.getPath() + ', append: ' + append);
            printJavaStack();
            return this.$init(file, append);
        };
    
        FileOutputStream.$init.overload('java.io.FileDescriptor').implementation = function (fdObj) {
            console.log('FileOutputStream opened with FileDescriptor: ' + fdObj.toString());
       
            return this.$init(fdObj);
        };
    
        FileOutputStream.$init.overload('java.lang.String').implementation = function (path) {
            console.log('FileOutputStream opened: ' + path);
            return this.$init(path);
        };
    
        FileOutputStream.$init.overload('java.lang.String', 'boolean').implementation = function (path, append) {
            console.log('FileOutputStream(java.lang.String', 'boolean) opened: ' + path + ', append: ' + append);
         
            return this.$init(path, append);
        };
    });
}


function hook_File2(){
    Java.perform(function () {
        var FileInputStream = Java.use('java.io.FileInputStream');
        var FileOutputStream = Java.use('java.io.FileOutputStream');
    
        // Hook FileInputStream
        FileInputStream.$init.overload('java.io.File').implementation = function (file) {
            try {
                this.$init(file);
                console.log('FileInputStream opened successfully: ' + file.getPath());
            } catch (e) {
                console.log('Failed to open FileInputStream: ' + file.getPath() + ', Exception: ' + e);
            }
        };
    
        FileInputStream.$init.overload('java.io.FileDescriptor').implementation = function (fdObj) {
            try {
                this.$init(fdObj);
                console.log('FileInputStream opened with FileDescriptor: ' + fdObj.toString());
            } catch (e) {
                console.log('Failed to open FileInputStream with FileDescriptor: ' + fdObj.toString() + ', Exception: ' + e);
            }
        };
    
        FileInputStream.$init.overload('java.lang.String').implementation = function (path) {
            try {
                this.$init(path);
                console.log('FileInputStream opened successfully: ' + path);
            } catch (e) {
                console.log('Failed to open FileInputStream: ' + path + ', Exception: ' + e);
            }
        };
    
        // Hook FileOutputStream
        FileOutputStream.$init.overload('java.io.File').implementation = function (file) {
            try {
                this.$init(file);
                console.log('FileOutputStream opened successfully: ' + file.getPath());
            } catch (e) {
                console.log('Failed to open FileOutputStream: ' + file.getPath() + ', Exception: ' + e);
            }
        };
    
        FileOutputStream.$init.overload('java.io.File', 'boolean').implementation = function (file, append) {
            try {
                this.$init(file, append);
                console.log('FileOutputStream opened successfully: ' + file.getPath() + ', append: ' + append);
            } catch (e) {
                console.log('Failed to open FileOutputStream: ' + file.getPath() + ', append: ' + append + ', Exception: ' + e);
            }
        };
    
        FileOutputStream.$init.overload('java.io.FileDescriptor').implementation = function (fdObj) {
            try {
                this.$init(fdObj);
                console.log('FileOutputStream opened with FileDescriptor: ' + fdObj.toString());
            } catch (e) {
                console.log('Failed to open FileOutputStream with FileDescriptor: ' + fdObj.toString() + ', Exception: ' + e);
            }
        };
    
        FileOutputStream.$init.overload('java.lang.String').implementation = function (path) {
            try {
                this.$init(path);
                console.log('FileOutputStream opened successfully: ' + path);
            } catch (e) {
                console.log('Failed to open FileOutputStream: ' + path + ', Exception: ' + e);
            }
        };
    
        FileOutputStream.$init.overload('java.lang.String', 'boolean').implementation = function (path, append) {
            try {
                this.$init(path, append);
                console.log('FileOutputStream opened successfully: ' + path + ', append: ' + append);
            } catch (e) {
                console.log('Failed to open FileOutputStream: ' + path + ', append: ' + append + ', Exception: ' + e);
            }
        };
    });
}


function print_data_byteBuffer(thiz){
    var byteBuffer=MyGetFiled(thiz,"ckeb","a");
    LogPrint(Bytes2HexString(byteBuffer));
    
}


function GetphoneType(){
    var i =0;
   
        var Context = Java.use('android.content.Context');
        var cbip = Java.use("cgtn");
        var Base64 = Java.use('android.util.Base64');
        var File = Java.use('java.io.File');
        var FileOutputStream = Java.use('java.io.FileOutputStream');
        var OutputStreamWriter = Java.use('java.io.OutputStreamWriter');
    
        cbip["c"].implementation = function (context0, cbgo0) {
            console.log(`cepc.c is called: context0=${context0}, cbgo0=${cbgo0}`);
            
            var result= this["c"] (context0, cbgo0);

            
            let parcel = Java.use("android.os.Parcel").obtain();
            result.writeToParcel(parcel, 0);
            let base64string = Base64.encodeToString(parcel.marshall(), Base64.DEFAULT.value);
            console.log("序列化后的数据：" + base64string);
    
            // Writing to file
            try {
                var appDir = context0.getFilesDir().getAbsolutePath();
                var filePath = appDir + "/com.google.android.apps.classroom"+i+".json";
                LogPrint("文件路径=>"+filePath);
                let file = File.$new(filePath);                  
                if (!file.exists()) {
                    file.createNewFile();  // 如果文件不存在，就创建它
                }
                let fos = FileOutputStream.$new(file, false);  // false表示不追加，直接覆盖
                let writer = OutputStreamWriter.$new(fos);
    
                writer.write(base64string, 0, base64string.length);
                writer.flush();
                writer.close();
                fos.close();
    
                console.log("Data written to file: " + filePath);
            } catch (e) {
                console.log("Error writing to file: " + e.toString());
            }
            i=i+1;
            return result;
        };
 

}

function FindDex(){
        
    Java.enumerateClassLoaders({
        "onMatch" : function(loader){
             console.log(" classFactory ========== " + loader.toString());

        },
        "onComplete": function(){

        }
    });
}

function isProxy(){
    var Proxy = Java.use('java.lang.reflect.Proxy');

    // 重写 isProxyClass 方法
    Proxy.isProxyClass.implementation = function (cls) {
        // 原始的 isProxyClass 方法调用
        console.log(" Proxy.isProxyClass: " + cls);
        var originalResult = this.isProxyClass(cls);
  
        // 如果原本是代理类，改为返回 false
        if (originalResult) {
            console.log(" Proxy.isProxyClass: " + cls+" ,isProxy!!!");
            //return false;
        }
  
        // 否则返回原始结果
        return originalResult;
    };
}
function hookDialog(){
    var Dialog = Java.use('android.app.Dialog');
    Dialog.show.implementation = function () {
        console.log("Dialog.show() called");
        // 打印调用栈
        printJavaStack();
        // 继续执行原始的show方法
        this.show();
    };
}

function hookSetLocale(){

    // 获取 java.util.Locale 类
    var Locale = Java.use('java.util.Locale');



    // 创建一个表示美国的 Locale 实例
    var usLocale = Locale.US.value;

    // 替换 setDefault 方法的实现
    Locale.setDefault.overload('java.util.Locale').implementation = function (locale) {
        console.log('[*] Original Locale set to: ' + locale.toString());
      

        // 调用原始的 setDefault 方法，使用美国 Locale
        //printJavaStack();
        this.setDefault(locale);
    };
    
    Locale.setDefault.overload('java.util.Locale$Category', 'java.util.Locale').implementation = function (Locale1,locale) {
        console.log('[*] Original Locale1 set to: '+Locale1+" Locale2" + locale.toString());
        //printJavaStack();

        // 调用原始的 setDefault 方法，使用美国 Locale
        this.setDefault(Locale1, locale);
    };
}

function hookGetLocale(){
    var Locale = Java.use('java.util.Locale');

    // 替换 getDefault 方法实现
    Locale.getDefault.overload().implementation = function () {
        // 创建并返回一个代表美国的 Locale 实例
      
      
        var result=this.getDefault();
     //  console.log(Locale.US.value+" cls=> "+Locale.US.value.$className+" , sult1=> "+result);
       console.log("sult1=> "+result);
      // printJavaStack();

        //return Locale.US.value;
       return result;
    };



    // 针对 Android API 级别 >= 24
    var LocaleList = null;
    try {
        LocaleList = Java.use('android.os.LocaleList');
        
    } catch (err) {
        // Android API < 24，没有 LocaleList 类
        console.log('LocaleList not found, skipping.');
    } 

    if (LocaleList !== null) {
        // 修正后的方法调用，使用正确的构造函数重载
        LocaleList.getDefault.implementation = function () {
            var usLocale = Locale.US.value;
            var localeArray = Java.array('java.util.Locale', [usLocale]);
           // console.log("修改美国实例2");
           var result=this.getDefault();
           //console.log(Locale.US.value+" cls=> "+Locale.US.value.$className+" , sult2=> "+result);
           console.log("sult2=> "+result);
          // printJavaStack();
          //  return LocaleList.$new(localeArray);
          return result;
        }
    }

        //   // Hook getAdjustedDefault 静态方法
        LocaleList.getAdjustedDefault.implementation = function () {
            // 创建一个表示美国的 Locale 实例
            var Locale = Java.use("java.util.Locale");
            //var usLocale = Locale.US.value;
            var result=this.getAdjustedDefault();
            // 使用美国 Locale 实例创建一个新的 LocaleList 并返回
            //var newLocaleList = LocaleList.$new([usLocale]);
           // return newLocaleList;
           return result;
        };


            
    //定位到包含 updateLocaleListFromAppContext 方法的类
    // 注意: 这里使用的类名和方法名需要根据实际情况进行调整
    var ConfigurationController = Java.use("android.app.ConfigurationController");

    // Hook updateLocaleListFromAppContext 方法
    ConfigurationController.updateLocaleListFromAppContext.implementation = function (context) {
        console.log("updateLocaleListFromAppContext called");

        // 调用原始方法前获取 bestLocale 和 newLocaleList 的内容
        var bestLocale = context.getResources().getConfiguration().getLocales().get(0);
        console.log("Best Locale: " + bestLocale.toString());

        // var newLocaleList = this.mResourcesManager.getConfiguration().getLocales();
        // console.log("New LocaleList: " + newLocaleList.toString());

        // 调用原始的 updateLocaleListFromAppContext 方法
        this.updateLocaleListFromAppContext(context);
    };

}


function changGetProperty(){
    // 保存原始的getProperty方法
    var System = Java.use("java.lang.System");
   var originalGetProperty = System.getProperty;

   // 重写getProperty方法
   System.getProperty.overload('java.lang.String').implementation = function(property) {
       console.log('System.getProperty called with property: ' + property);

       特定的属性返回特定的值
       if (property === "java.vm.version") {
           
           return "2.1.0"; // 模拟Android 9的VM版本
       } else if (property === "http.agent") {
           // 返回自定义的user-agent
           return "Dalvik/2.1.0 (Linux; U; Android 9; CustomDevice Build/CustomBuild)";
       } else if (property === "gamematrix.game_data") {
           // 返回gamematrix.game_data的模拟值
           return "game_data_example";
       } else if (property === "gamematrix.login") {
           // 返回gamematrix.login的模拟值
           return "QQ";
       } else if (property === "gamematrix.isCloudRender") {
           // 返回gamematrix.isCloudRender的模拟值
           return "true";
       }
       // 对于其他键，返回原始方法的调用结果
      return originalGetProperty.call(this, property);
 
   };
}

function hook_getProperty(){
    var System = Java.use("java.lang.System");
    var getProperty = System.getProperty.overload('java.lang.String');

    getProperty.implementation = function (propertyName) {
        // Call the original getProperty method
        var propertyValue = getProperty.call(System, propertyName);

        // Log the property name and its value
        console.log("System.getProperty called with property: " + propertyName + ". Value: " + propertyValue);

        // Return the property value
        return propertyValue;
    };
}


function hookWebViewInit(){
    // Hook WebView's constructor
var WebView = Java.use('android.webkit.WebView');
WebView.$init.overload('android.content.Context').implementation = function (context) {
   console.log('WebView initialized with context');
   printJavaStack();
   // Call the original constructor
   this.$init(context);
   
   // Your custom logic here (e.g., setting a WebViewClient or WebChromeClient)
};

// Example of hooking loadUrl to monitor URL loading
WebView.loadUrl.overload('java.lang.String').implementation = function (url) {
   console.log('Loading URL: ' + url);
   
   // Call the original loadUrl method
   this.loadUrl(url);
};

// Example of hooking evaluateJavascript for monitoring JavaScript execution
WebView.evaluateJavascript.overload('java.lang.String', 'android.webkit.ValueCallback').implementation = function (script, callback) {
   console.log('Executing JavaScript: ' + script);
   
   // Call the original evaluateJavascript method
   this.evaluateJavascript(script, callback);
};
}


function find_android_dlopen_ext(){
    Interceptor.attach(Module.findExportByName(null, "android_dlopen_ext"), {
        onEnter: function(args) {
            // 获取并打印包含 "android_dlopen_ext" 函数的模块信息
            var module = Process.findModuleByAddress(this.context.pc);
            if (module) {
                console.log(`函数 "android_dlopen_ext" 位于模块 "${module.name}" 中`);
                console.log(`模块路径: ${module.path}`);
            }
        }
    });
}
function hook_nativeFile(){
    Interceptor.attach(Module.findExportByName('libc.so', 'open'), {
        onEnter: function (args) {
            // args[0] 是 open 函数的第一个参数，即文件路径
            // 因为它是一个指向字符数组（字符串）的指针，我们可以使用 readCString 来获取实际的文件路径
            var filePath = Memory.readCString(args[0]);
            console.log('Opening file: ' + filePath);
        }
    });
    Interceptor.attach(Module.findExportByName("libc.so", "creat"), {
        onEnter: function(args) {
            var path = Memory.readCString(args[0]);
            console.log("creat called with path: " + path);
        }
    });
    Interceptor.attach(Module.findExportByName("libc.so", "mkdir"), {
        onEnter: function(args) {
            var path = Memory.readCString(args[0]);
            console.log("mkdir called with path: " + path);
        }
    });

    Interceptor.attach(Module.findExportByName("libc.so", "access"), {
        onEnter: function(args) {
            this.path = Memory.readCString(args[0]);
            this.mode = args[1];
        },
        onLeave: function(retval) {
            if (retval.toInt32() == 0) {
                console.log("access: File exists - " + this.path);
            } else {
                console.log("access: File does not exist - " + this.path);
            }
        }
    });

    Interceptor.attach(Module.findExportByName("libc.so", "stat"), {
        onEnter: function(args) {
            this.path = Memory.readCString(args[0]);
        },
        onLeave: function(retval) {
            if (retval.toInt32() == 0) {
                console.log("stat: File exists - " + this.path);
            } else {
                console.log("stat: File does not exist - " + this.path);
            }
        }
    });
}
function tools(){
    //hook_nativeFile();
    // hook_File();
    // hook_File2();
    // hook_File_Open();
    hook_All_Intent();
    Hook_startActivityForResult();
    Hook_startActivity();
    printPendingIntentSend();

    hook_bindService();

    //hook_Messager();
   //hook_All_ActivityLife();
   hook_ActivitryLife_onInstrumentation();
   find_View_Click_ClassName();
   hookDialog();
   //get_ClickClass();
//    Is_Pip();
//find_android_dlopen_ext();
//    //hook_userLeave();

 
//    hook_deviceSupportsPictureInPictureMode();



//   hook_startActivityes();

//hookKeyStoryAilas();
//hookUrl();
//isProxy();
//find_RegisterNatives();
//hookSetLocale();
//hookGetLocale();
//hook_getProperty();
//changGetProperty();
//hookWebViewInit();
//hook__system_property_get();
}
function main(){
    Java.perform(function () {
       tools();
   

        
    });
}


setImmediate(main);

