
module test {

    export class TetsReceiveOnceAndCancel {

        constructor() {
            console.log("test receive once and cancel");

            const data: IData = { msg: 0 };
            puremvc.Facade.getInstance().registerObserver("CUI_TEST", this.$testNor, this, false);
            puremvc.Facade.getInstance().registerObserver("CUI_TEST", this.$testOnce, this, true);
            console.assert(puremvc.Facade.getInstance().hasObserver("CUI_TEST", this.$testNor, this), `事件未注册成功或查询失败`);
            console.assert(puremvc.Facade.getInstance().hasObserver("CUI_TEST", this.$testNor, null), `仅指定method时查询事件失败`);
            console.assert(puremvc.Facade.getInstance().hasObserver("CUI_TEST", null, this), `仅指定caller时查询事件失败`);

            puremvc.Facade.getInstance().sendNotification("CUI_TEST", data);
            console.assert(data.msg === 12, `不同回调监听同一个事件时未成功`);

            puremvc.Facade.getInstance().sendNotification("CUI_TEST", data);
            console.assert(data.msg === 14, `一次性事件未移除`);

            puremvc.Facade.getInstance().registerObserver("CUI_TEST", this.$doCancel, this);
            puremvc.Facade.getInstance().registerObserver("CUI_TEST", this.$testCancel, this);
            puremvc.Facade.getInstance().sendNotification("CUI_TEST", data, true);
            console.assert(data.msg === 16, `事件派发未能成功中断`);

            puremvc.Facade.getInstance().removeObserver("CUI_TEST", this.$testNor, this);
            puremvc.Facade.getInstance().removeObserver("CUI_TEST", this.$testCancel, this);
            puremvc.Facade.getInstance().removeObserver("CUI_TEST", this.$doCancel, this);
        }

        private $testNor(data: IData): void {
            data.msg += 2;
        }

        private $testOnce(data: IData): void {
            data.msg += 10;
        }

        private $testCancel(data: IData): void {
            data.msg += 2;
        }

        private $doCancel(): void {
            puremvc.Facade.getInstance().notifyCancel();
        }
    }

    interface IData {

        msg: number;
    }
}