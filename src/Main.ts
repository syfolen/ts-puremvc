
//程序入口
Laya.init(600, 400, Laya.WebGL);

puremvc.Facade.getInstance().registerObserver("ok", func, null, true, 1, ["a"]);

puremvc.Facade.getInstance().sendNotification("ok", "b");
puremvc.Facade.getInstance().sendNotification("ok", "b");

function func(s0: string, s1: string): void {
    console.log(s0, s1)
}