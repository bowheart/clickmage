(function() {
	var BigNum = function(numIn) {
		this.num = [0];
		this.dec = 0.0;
		return numIn ? this.add(numIn) : this.str();
	}
	BigNum.prototype = {
		add: function(numIn) {
			numIn = calcDec.call(this, calcDecAdd, numIn);
			
			for (var i = 0; i < numIn.length; i++) {
				this.num[i] || (this.num[i] = 0);
				this.num[i] += +numIn[i];
				
				if (this.num[i] < 10) continue;
				
				// carry the one
				this.num[i] -= 10;
				numIn[i + 1] = (+numIn[i + 1] || 0) + 1;
			}
			return this.str();
		},
		
		subtract: function(numIn) {
			numIn = calcDec.call(this, calcDecSubtract, numIn);
			
			for (var i = 0; i < numIn.length; i++) {
				this.num[i] || (this.num[i] = 0);
				this.num[i] -= +numIn[i];
				
				if (this.num[i] >= 0) continue;
				
				// borrow
				this.num[i] += 10;
				this.subtract(new BigNum('10' + Array(i + 1).join('0')));
			}
			return this.str();
		},
		
		divide: function(numIn) {
			numIn = calcDec.call(this, calcDecDivide, numIn);
			var multiplier = 1;
			var total = 0;
			
			for (var i = 0; i < numIn.length; i++) {
				multiplier *= 
			}
		},
		
		str: function(noCommas, withDec) {
			var retString = this.num.join('');
			if (!noCommas) {
				retString = retString.replace(/(\d{3})/g, '$1,').split('').reverse();
				if (retString[0] === ',') retString.shift();
				retString = retString.join('');
			}
			return retString + (withDec ? '.' + this.dec : '');
		}
	};
	
	var calcDec = function(next, numIn) {
		var numIn = (numIn instanceof BigNum
			? numIn.str(true, true)
			: numIn);
		var split = ('' + numIn).split('.');
		
		if (split.length > 1) split = next.call(this, +split[0], +split[1]);
		return ('' + split[0]).split('').reverse();
	};
	
	var calcDecAdd = function(int, dec) {
		this.dec += +('.' + dec);
		
		if (this.dec > 1) { // carry the one
			this.dec -= 1;
			int++;
		}
		return [int, dec];
	};
	
	var calcDecSubtract = function(int, dec) {
		this.dec -= +('.' + dec);
		
		if (this.dec < 0) { // borrow
			this.dec += 1;
			this.subtract(1);
		}
		return [int, dec];
	};
	
	var calcDecDivide = function(int, dec) {
		this.dec /= +('.' + dec);
		return [int, dec];
	}
	
	
	
	this.BigNum = function(numIn) {
		return new BigNum(numIn);
	};
	
}).call(this);
