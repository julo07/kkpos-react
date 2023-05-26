class CalculationHandler {
    constructor(setProducts) {
      this.products = [];
      this.totalPrice = 0;
    }
  
    addProduct(product, setProducts) {
      setProducts((prevProducts) => {
        const isDuplicate = prevProducts.some((p) => p.id === product.id);
        if (isDuplicate) {
          window.alert('Product already exists.');
          return prevProducts;
        }
        console.log(this.products)
        this.products = [...prevProducts, product];
        // Perform any other necessary calculations
        console.log(this.getProducts());
        return this.products;
      });
    }
  
    removeProduct(productId) {
      const index = this.products.findIndex((p) => p.id === productId);
  
      if (index !== -1) {
        this.products.splice(index, 1);
        this.calculateTotalPrice();
      }
    }
  
    updateProductQuantity(productId, newQuantity) {
      const product = this.products.find((p) => p.id === productId);
      console.log(this.getProducts());
      if (product) {
        product.quantity = newQuantity;
        console.log(product)
        this.calculateTotalPrice();
      }
      else{console.log(productId, this.products)}
    }
  
    updateProductPrice(productId, newPrice) {
      const product = this.products.find((p) => p.id === productId);
  
      if (product) {
        product.price = newPrice;
        this.calculateTotalPrice();
      }
    }
  
    calculateTotalPrice() {
    let totalPrice = 0;

    this.products.forEach((product) => {
      const quantity = product.quantity || 0;
      const price = product.price || 0;
      totalPrice += quantity * price;
    });

    this.totalPrice = totalPrice;
  }
  
    getTotalPrice() {
      return this.totalPrice;
    }
  
    getProducts() {
      return this.products;
    }
  }
  
  export default CalculationHandler;
  