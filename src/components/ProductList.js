import React, { Component } from "react";
import Product from "./Product";
import Title from "./Title";
// Import the context api consumer
import { ProductConsumer } from "../context";

export default class ProductList extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="py-5">
          <div className="container">
            <Title name="our" title="products" />
            <div className="row">
              {/* Value from context does not get passed down in props. Must use a function to retrieve the value data from the context provider, then pass it down and render it */}
              <ProductConsumer>
                {value => {
                  console.log(value);
                  // Loop through the array and display each array item
                  return value.products.map(product => {
                    // To return an list of items, indicate the key value for each item as well as the object that will be returned (in this case, product)
                    return <Product key={product.id} product={product} />;
                  });
                  // return <h1>{value}</h1>;
                }}
              </ProductConsumer>
            </div>
          </div>
        </div>
      </React.Fragment>
      // <Product />
    );
  }
}
