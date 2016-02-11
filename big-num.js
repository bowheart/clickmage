(function() {
	var BigNum = function(numIn) {
		this.num = [0];
		this.dec = 0.0;
		return numIn ? this.add(numIn) : this.str;
	}
	BigNum.prototype = {
		add: function(numIn) {
			numIn = (numIn instanceof BigNum
				? numIn.num
				: calcDec.call(this, numIn));
			
			for (var i = 0; i < numIn.length; i++) {
				this.num[i] || (this.num[i] = 0);
				this.num[i] += +numIn[i];
				var leftover = this.num[i] - 10;
				if (!leftover || leftover <= 0) continue;
				
				this.num[i] %= 10;
				numIn[i + 1] = (+numIn[i + 1] || 0) + 1;
			}
			return this.str;
		},
		
		get str() {
			var withCommas = this.num.join('').replace(/(\d{3})/g, '$1,').split('').reverse();
			if (withCommas[0] === ',') withCommas.shift();
			return withCommas.join('');
		}
	};
	
	var calcDec = function(numIn) {
		var strNum = '' + numIn,
			split = strNum.split('.');
		if (split.length > 1) {
			var dec = split[1];
			this.dec += +('.' + dec);
			var leftover = this.dec - 1;
			if (leftover > 0) {
				this.dec %= 1;
				split[0] = (+split[0] + 1);
			}
		}
		return ('' + split[0]).split('').reverse();
	};
	
	this.BigNum = function(numIn) {
		return new BigNum(numIn);
	};
	
}).call(this);
