// This will allow us to use the React context API, which acts similar to Redux in the sense that it provides all the data in props within a single store, or single source of truth

import React, { Component } from "react";
import { storeProducts, detailProduct } from "./data";
//
// Create the context object
const ProductContext = React.createContext();
// Comes with two components:
// Provider: provides all the information for the entire application (this goes on top)
// Consumer: This uses all the information from the provider, which means that there is no need to pass on props to any child components, since they can jut be used wherever in the application

class ProductProvider extends Component {
  // Set the state and populate the product listings

  state = {
    // Set the initial state of the products array (create temporary state instead of product reference)
    products: [],
    // This value does not change, so fine to use reference from data
    detailProduct: detailProduct,
    cart: [],
    // cart: storeProducts,
    // Set modal state
    modalOpen: false,
    modalProduct: detailProduct,
    cartSubtotal: 0,
    cartTax: 0,
    cartTotal: 0
  };
  // Upon component mount, call the setProducts function to load the state with the original values of the set data set
  componentDidMount() {
    this.setProducts();
  }
  // Later on, implement pouchDB for cached state
  setProducts = () => {
    // Initialize the products array
    let tempProducts = [];
    // Run through each item in the data set and populate with fields
    storeProducts.forEach(item => {
      const singleItem = { ...item };
      // Add each store item to the products array
      tempProducts = [...tempProducts, singleItem];
    });
    this.setState(() => {
      return { products: tempProducts };
    });
  };
  // This method gets the item according to the id
  getItem = id => {
    const product = this.state.products.find(item => item.id === id);
    return product;
  };

  handleDetail = id => {
    const product = this.getItem(id);
    this.setState(() => {
      return { detailProduct: product };
    });
  };

  addToCart = id => {
    let tempProducts = [...this.state.products];
    // The index value fixes the place of the product within the home screen. Holds all the products in the single temporary session of the product state. Using temp session to avoid mutating real state, only the current user's state
    // The following definitiion finds the placement of the product in the current state using the getItem method and passing in the id. This gives the current index of the product based on the current state
    const index = tempProducts.indexOf(this.getItem(id));
    // Now when a product is added, it is defined by the index of the current item in the tempProducts array based on the getItem(id)
    const product = tempProducts[index];
    // Add product to cart
    product.inCart = true;
    // Increase product count
    product.count = 1;
    // Define product price
    const price = product.price;
    // Set total to defined product price
    product.total = price;
    // Set the state to reflect that the product is in teh cart
    this.setState(
      () => {
        return {
          // Set the products array to that of the temporary products state
          products: tempProducts,
          // set the cart equal to the destructured state's cart and add the new product to it
          cart: [...this.state.cart, product]
        };
      },
      () => {
        this.addTotals();
      }
    );
  };

  //   Open the modal based on the product id
  openModal = id => {
    // retrieve the current item and set it to the product
    const product = this.getItem(id);
    this.setState(() => {
      return {
        modalProduct: product,
        modalOpen: true
      };
    });
  };

  //  Close the modal
  closeModal = () => {
    this.setState(() => {
      return { modalOpen: false };
    });
  };

  increment = id => {
    // Get cart items from state
    let tempCart = [...this.state.cart];
    // Identify the selected product
    const selectedProduct = tempCart.find(item => item.id === id);
    // Find the index of the specific item
    const index = tempCart.indexOf(selectedProduct);
    const product = tempCart[index];
    // Increment the product count
    product.count = product.count + 1;
    // Update the product total
    product.total = product.count * product.price;

    this.setState(
      // function that changes the cart values for the state
      () => {
        return { cart: [...tempCart] };
      },
      // update the totals
      () => {
        this.addTotals();
      }
    );
  };
  decrement = id => {
    // Get cart items from state
    let tempCart = [...this.state.cart];
    // Identify the selected product
    const selectedProduct = tempCart.find(item => item.id === id);
    // Find the index of the specific item
    const index = tempCart.indexOf(selectedProduct);
    const product = tempCart[index];
    // Decrement the product count
    product.count = product.count - 1;
    // If product count reaches 0 just remove the item
    if (product.count === 0) {
      this.removeItem(id);
    } else {
      // Otherwise, update teh price
      product.total = product.count * product.price;
      this.setState(
        // function that changes the cart values for the state
        () => {
          return { cart: [...tempCart] };
        },
        // update the totals
        () => {
          this.addTotals();
        }
      );
    }
  };
  removeItem = id => {
    // Create two arrays for the products and the cart and destructure the values
    let tempProducts = [...this.state.products];
    let tempCart = [...this.state.cart];
    // Filter through the cart to keep only the items that to not match passed id (basically removes only the item with the passed id)
    tempCart = tempCart.filter(item => item.id !== id);
    // Find the index value for the item that is to be removed
    const index = tempProducts.indexOf(this.getItem(id));
    let removedProduct = tempProducts[index];
    // Reset all the values for that product to the default
    removedProduct.inCart = false;
    removedProduct.count = 0;
    removedProduct.total = 0;

    this.setState(
      () => {
        return {
          cart: [...tempCart],
          products: [...tempProducts]
        };
      },
      () => {
        this.addTotals();
      }
    );
  };
  clearCart = () => {
    this.setState(
      // First return an empty cart array
      () => {
        return { cart: [] };
      },
      // Next, set all the product states on the homepage to their default setting (removes the incart label), and run the addTotals function to reset the totals (it will be 0 since there's nothing in cart)
      () => {
        this.setProducts();
        this.addTotals();
      }
    );
  };
  addTotals = () => {
    let subTotal = 0;
    this.state.cart.map(item => (subTotal += item.total));
    const tempTax = subTotal * 0.1;
    const tax = parseFloat(tempTax.toFixed(2));
    const total = subTotal + tax;
    this.setState(() => {
      return {
        cartSubtotal: subTotal,
        cartTax: tax,
        cartTotal: total
      };
    });
  };

  render() {
    return (
      // First return the product context provider, which will sit on top of components. In order to use in the entire app, needs to sit at the highest point in the application, so will place a reference in index.js
      // The provider will contain the value to pass on to the children
      //   Keep in mind: value can be an object, not just a string
      <ProductContext.Provider
        value={{
          // Destructure the properties from the state
          ...this.state,
          handleDetail: this.handleDetail,
          addToCart: this.addToCart,
          openModal: this.openModal,
          closeModal: this.closeModal,
          increment: this.increment,
          decrement: this.decrement,
          removeItem: this.removeItem,
          clearCart: this.clearCart
        }}
      >
        {/* Next, return all children components in the application */}
        {this.props.children}
      </ProductContext.Provider>
    );
  }
}

const ProductConsumer = ProductContext.Consumer;

export { ProductProvider, ProductConsumer };
