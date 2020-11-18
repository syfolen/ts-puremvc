
module test {

    export class TestView {

        static count: number = 0;

        constructor() {
            console.log("test view");
            puremvc.Facade.getInstance().registerMediator(new CUIMediator(CUIMediator.NAME));
            console.assert(puremvc.Facade.getInstance().hasMediator(CUIMediator.NAME), "CUIMediator 未注册");
            console.assert(TestView.count === 1, "CUIProxy onremove 未运行");

            const mediator = puremvc.Facade.getInstance().retrieveMediator(CUIMediator.NAME) as CUIMediator;
            console.assert(mediator !== null, "CUIMediator 获取失败");

            const data: IData = { msg: 0 };
            puremvc.Facade.getInstance().sendNotification("CUI_TEST", [data, 1]);
            console.assert(data.msg === 1, "mediator 的回调未执行");

            puremvc.Facade.getInstance().removeMediator(CUIMediator.NAME);
            console.assert(puremvc.Facade.getInstance().hasMediator(CUIMediator.NAME) === false, "CUIMediator 未移除");
            console.assert(TestView.count === 2, "CUIProxy onremove 未运行");

            puremvc.Facade.getInstance().sendNotification("CUI_TEST");
            puremvc.Facade.getInstance().sendNotification("CUI_TEST", [data, 1]);
            console.assert(data.msg === 1, "mediator 的回调未移除");
        }
    }

    class CUIMediator extends puremvc.Mediator {

        static readonly NAME: string = "CUIMediator";

        onRegister(): void {
            TestView.count++;
        }

        onRemove(): void {
            TestView.count++;
        }

        listNotificationInterests(): void {
            this.$handleNotification("CUI_TEST", this.$test3, suncom.EventPriorityEnum.LOW);
        }

        private $test3(data: IData, msg: number): void {
            data.msg = msg;
        }
    }

    interface IData {

        msg: number;
    }
}