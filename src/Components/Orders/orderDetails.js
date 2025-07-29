import React from "react";
import ProductsSlider from "../../Home/productSlider";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const OrderDetails = ({
  ordersData, // Array of order objects to display
  reversedOrders, // Specially ordered version of orders (typically recent first)
  handleCancelOrder, // Function to handle order cancellation
  handleReturnOrder, // Function to handle order returns
}) => {
  return ordersData.length > 0 ? (
    // =============== ORDER HISTORY SECTION ===============
    <div className="ml-[8%] mdl:ml-[15%]">
      {/* Map through each order to display details */}
      {ordersData.map((order, index) => (
        <motion.div
          initial={{ y: 1000, opacity: 0 }} // Animation start state
          animate={{ y: 0, opacity: 1 }} // Animation end state
          transition={{ duration: 0.5 }} // Animation duration
          key={index}
          className="w-[90%] mdl:w-[80%] border h-[50%] rounded-md my-5 flex flex-col"
        >
          {/* =============== ORDER HEADER SECTION =============== */}
          <div className="w-full flex flex-row flex-wrap gap-4 mdl:gap-5 mdl:justify-between py-3 bg-gray-100 border-b-[1px]">
            {/* Order metadata: date, total, shipping info */}
            <div className="flex flex-wrap h-9 gap-5 px-5">
              {/* Order date */}
              <div className="w-auto text-xs">
                <p>ORDER PLACED</p>
                <p className="font-semibold">
                  {new Date(order.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    weekday: "long",
                  })}
                </p>
              </div>

              {/* Order total */}
              <div className="w-auto text-xs h-auto">
                <p>TOTAL</p>
                <p className="font-semibold">₹{order.price}</p>
              </div>

              {/* Shipping recipient */}
              <div className="w-auto text-xs h-auto">
                <p>SHIP TO</p>
                <p className="font-semibold text-blue-400">
                  {order.address.name}
                </p>
              </div>
            </div>

            {/* Order ID display */}
            <div className="px-5">
              <div className="w-full text-xs">
                <p>
                  ORDER ID :{" "}
                  <span className="font-semibold text-blue-600">
                    {order.uniqueNumber}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* =============== ORDER CONTENT SECTION =============== */}
          <div className="w-full h-auto my-4 ">
            <div className="w-auto h-auto flex justify-between items-center gap-5 flex-wrap">
              <div className="w-auto h-auto flex flex-col mdl:flex-row gap-7">
                {/* Product thumbnail */}
                <div>
                  <img
                    className="w-full mdl:w-52 h-52"
                    src={order.thumbnail}
                    alt="order"
                  />
                </div>

                {/* Product details and actions */}
                <div className="w-[95%] mdl:w-[70%] mx-auto flex flex-col gap-4 mt-3 justify-between">
                  <div className="flex flex-col gap-5">
                    {/* Product title with link to product page */}
                    <div>
                      <Link to={`/${order.category}/${order.title}`}>
                        <p className="text-lg font-semibold">{order.title}</p>
                      </Link>
                    </div>

                    {/* Full shipping address details */}
                    <div className="capitalize -mt-1 text-sm mdl:text-base">
                      <span className="font-semibold">
                        {order.address.name}
                      </span>
                      <span> {order.address.address}</span>
                      <span>, {order.address.area}</span>
                      <span>, {order.address.landmark}</span>
                      <span>, {order.address.city} </span>
                      <span>, {order.address.pincode}</span>
                      <span>, State : {order.address.state}</span>
                      <span>, Country : {order.address.country}</span>
                      <span className="font-semibold">
                        , Mobile Number : {order.address.mobile} &nbsp;
                      </span>
                    </div>

                    {/* Quantity ordered */}
                    <div className="flex items-center font-semibold ">
                      Qty : {order.quantity}
                    </div>

                    {/* Payment method used */}
                    <div className="flex items-center font-semibold">
                      Payment Method :{" "}
                      <span className="capitalize text-blue-600">
                        &nbsp;{order.paymentMethod}
                      </span>
                    </div>
                  </div>

                  {/* Action buttons (only shown for recent orders) */}
                  {
                    // Show cancel/return only for recent orders (reversedOrders)
                    ordersData === reversedOrders && (
                      <div className="flex">
                        <button
                          onClick={() => {
                            handleCancelOrder(order);
                          }}
                          className="pr-3 border-r-2 text-blue-600 "
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            handleReturnOrder(order);
                          }}
                          className="px-3 text-blue-600"
                        >
                          Return
                        </button>
                      </div>
                    )
                  }
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  ) : (
    // =============== EMPTY STATE SECTION ===============
    <div>
      {/* Message for no orders */}
      <div className="flex items-center mx-[10%] mdl:mx-[30%]">
        Looks like you haven't placed an order yet.
      </div>

      {/* Product recommendations */}
      <div>
        <ProductsSlider />
      </div>
    </div>
  );
};

export default OrderDetails;
