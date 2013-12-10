
if(!Array.prototype.any) {
  Array.prototype.any = function(reference) {
    for(var i = 0; i < this.length; ++i)
      if(this[i] == reference) return true;
    return false;
  }
}