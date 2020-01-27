module.exports = {
	 test_object: {
		test_key: "test_value",
		another_test_key: 42
	}, test_func: function(){
		return ('Passed in:\n' + JSON.stringify(arguments));
	}, test_promising_func: function(){
		return new Promise(function(resolve, reject){
			setTimeout(function(){
				resolve('kept!!!')
			}, 200)
		})
	}
};

require('../../index');