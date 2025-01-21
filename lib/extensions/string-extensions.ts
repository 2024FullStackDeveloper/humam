declare global {
    interface String {
    capitalize(): string;
    toLowerFirstLetter():string;
    }
}


  String.prototype.capitalize = function(){
    return this.split("")
      .map((char) => char.toUpperCase())
      .join("");
  }
  
  String.prototype.toLowerFirstLetter = function(){
    if(!this) return this as string;
    try{
    return this.charAt(0).toLowerCase() + this.slice(1);
    }catch{
      return this as string;
    }
  }

  export {};