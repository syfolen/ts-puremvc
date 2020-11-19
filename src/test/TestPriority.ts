
module test {

    let array = [];

    export class TestPriority {

        constructor() {
            console.log("test priority");
            puremvc.Facade.getInstance().registerMediator(new CUIMediator(CUIMediator.NAME));
            puremvc.Facade.getInstance().registerCommand("CUI_TEST", TestCommand, suncom.EventPriorityEnum.OSL);

            puremvc.Facade.getInstance().registerObserver("CUI_TEST", this.$testFwl, this, false, suncom.EventPriorityEnum.FWL);
            puremvc.Facade.getInstance().registerObserver("CUI_TEST", this.$testEgl, this, false, suncom.EventPriorityEnum.EGL);

            puremvc.Facade.getInstance().sendNotification("CUI_TEST");
            this.$aEqualsB(array, [
                suncom.EventPriorityEnum.OSL,
                suncom.EventPriorityEnum.EGL,
                suncom.EventPriorityEnum.FWL,
                suncom.EventPriorityEnum.HIGH,
                suncom.EventPriorityEnum.MID,
                suncom.EventPriorityEnum.LOW,
                suncom.EventPriorityEnum.LOWEST
            ]);

            puremvc.Facade.getInstance().removeCommand("CUI_TEST");
            puremvc.Facade.getInstance().removeObserver("CUI_TEST", this.$testFwl, this);
            puremvc.Facade.getInstance().removeObserver("CUI_TEST", this.$testEgl, this);
            puremvc.Facade.getInstance().removeMediator(CUIMediator.NAME);
        }

        private $testFwl(): void {
            array.push(suncom.EventPriorityEnum.FWL);
        }

        private $testEgl(): void {
            array.push(suncom.EventPriorityEnum.EGL);
        }

        private $aEqualsB(a: suncom.EventPriorityEnum[], b: suncom.EventPriorityEnum[]): void {
            for (let i = 0; i < a.length; i++) {
                console.assert(a[i] === b[i], `当前：[${a.join(",")}], 预期：[${b.join(",")}]`);
            }
        }
    }

    class CUIMediator extends puremvc.Mediator<Laya.View> {

        static readonly NAME: string = "CUIMediator";

        onRegister(): void {
            this.$viewComponent = new Laya.View();
            TestView.count++;
        }

        onRemove(): void {
            TestView.count++;
        }

        listNotificationInterests(): void {
            this.$handleNotification("CUI_TEST", this.$testLowest, suncom.EventPriorityEnum.LOWEST);
            this.$handleNotification("CUI_TEST", this.$testLow, suncom.EventPriorityEnum.LOW);
            this.$handleNotification("CUI_TEST", this.$testMid, suncom.EventPriorityEnum.MID);
            this.$handleNotification("CUI_TEST", this.$testHigh, suncom.EventPriorityEnum.HIGH);
        }

        private $testHigh(): void {
            array.push(suncom.EventPriorityEnum.HIGH);
        }

        private $testMid(): void {
            array.push(suncom.EventPriorityEnum.MID);
        }

        private $testLow(): void {
            array.push(suncom.EventPriorityEnum.LOW);
        }

        private $testLowest(): void {
            array.push(suncom.EventPriorityEnum.LOWEST);
        }
    }

    class TestCommand extends puremvc.SimpleCommand {

        execute(): void {
            array.push(suncom.EventPriorityEnum.OSL);
        }
    }
}