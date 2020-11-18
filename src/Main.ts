
//程序入口
Laya.init(600, 400, Laya.WebGL);

class Facade extends puremvc.Facade {

	static getInstance(): puremvc.Facade {
		return puremvc.Facade.inst || new Facade();
	}
}

setTimeout(() => {
	Facade.getInstance();

	new test.TestController();
	new test.TestModel();
	new test.TestView();
	new test.TestPriority();
	new test.TetsReceiveOnceAndCancel();
}, 500);