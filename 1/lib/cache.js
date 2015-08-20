function Cache() {
  this.map = {};
}
module.exports = Cache;

Cache.prototype.alloc = function alloc(size) {
  if (this.map[size] && this.map[size].length !== 0)
    return this.map[size].pop();

  return new Float64Array(size);
};

Cache.prototype.free = function free(arr) {
  if (this.map[arr.length])
    this.map[arr.length].push(arr);
  else
    this.map[arr.length] = [ arr ];
};
