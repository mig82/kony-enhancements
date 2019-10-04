
((definition) => {
	if(typeof kony.router !== "object"){
		kony.router = definition();
	}
})(function(){

	var history = [];
	var maxH = 5;
	var current;

	function _setCurrent(formId){
		current = formId;
	}
	function _getCurrent(){
		return current;
	}
	function _initHistory(){
		if(typeof history === "undefined"){
			history = [];
		}
		else if(history.length >= 1){
			history = [history[0]];
		}
	}

	function _init(maxHistory){
		_initHistory();
		if(typeof maxHistory !== "undefined" && !isNaN(maxHistory)){
			maxH = maxHistory;
		}
	}

	function _addToHistory(priorForm){

		if(priorForm && priorForm.id){
			var priorId = priorForm.id;
			//If the latest is not already the prior one, then add it.
			if(history.length === 0 || history[history.length - 1] !== priorId){

				//If there's no more roon in the history, remove the oldest after home.
				if(history.length >= maxH){
					history = history.slice(0,1).concat(history.slice(2));
				}
				history.push(priorId);
				//kony.print(`********Added ${priorId} to history. length ${history.length}`);
			}
		}
		else{
			return;
		}
	}

	function _goBack(context){
		if(history.length === 0){
			return;
		}
		else if(history.length === 1){
			_goTo(history[0], context, true);
		}
		else{
			_goTo(history.pop(), context, true);
		}
	}

	function _goHome(context){
		_goTo(history[0], context, true);
		_initHistory();
	}

	function _getHistory(){
		return JSON.parse(JSON.stringify(history));
	}

	function _goTo(friendlyName, context, isGoingBack){

		try{
			//TODO: Make compatible with non-MVC projects.
			(new kony.mvc.Navigation(friendlyName)).navigate(context);

			//Must defer getting the previous form to avoid issues on iOS.
			kony.timer.schedule("kronin-chronicler-" + Date.now(), ()=>{
				var priorForm = kony.application.getPreviousForm();
				if(!isGoingBack)_addToHistory(priorForm);
			}, 0, false);
		}
		catch(e){
			let message = "Can't navigate to form ";
			message +=	`by friendly name '${friendlyName}'\nError: ${e}`;

			//alert(message);
			if(typeof kony.ui.Toast === "undefined"){
				alert(message);
			}
			else{
				var toast = new kony.ui.Toast({
					text:message,
					duration: constants.TOAST_LENGTH_LONG
				});
				toast.show();
			}
		}
	}

	return {
		init: _init,
		goto: _goTo,
		goTo: _goTo,
		getCurrent: _getCurrent,
		setCurrent: _setCurrent,
		goBack: _goBack,
		goHome: _goHome,
		getHistory : _getHistory
	};
});