
module test {

    class CUIProxy extends puremvc.Proxy<number> {

        static readonly NAME: string = "CUIProxy";

        onRegister(): void {
            TestModel.count++;
        }

        onRemove(): void {
            TestModel.count++;
        }
    }

    export class TestModel {

        static count: number = 0;

        constructor() {
            console.log("test model");
            puremvc.Facade.getInstance().registerProxy(new CUIProxy(CUIProxy.NAME));
            console.assert(puremvc.Facade.getInstance().hasProxy(CUIProxy.NAME), "CUIProxy 未注册");
            console.assert(TestModel.count === 1, "CUIProxy onregister 未运行");

            const proxy = puremvc.Facade.getInstance().retrieveProxy(CUIProxy.NAME) as CUIProxy;
            console.assert(proxy !== null, "CUIProxy 获取失败");
            const data = proxy.getData();

            puremvc.Facade.getInstance().removeProxy(CUIProxy.NAME);
            console.assert(puremvc.Facade.getInstance().hasProxy(CUIProxy.NAME) === false, "CUIProxy 未移除");
            console.assert(TestModel.count === 2, "CUIProxy onremove 未运行");
        }
    }
}