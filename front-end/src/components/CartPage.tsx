import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function CartPage() {
  const { cartItems, removeFromCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const returnPage = location.state?.page ?? 1;
  const returnCategory = location.state?.category ?? '';

  const total = cartItems.reduce(
    (sum, item) => sum + item.book.price * item.quantity,
    0
  );

  return (
    <div className="container mt-4">
      <h1 className="mb-4">🛒 Your Cart</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.book.bookId}>
                <td>{item.book.title}</td>
                <td>${item.book.price.toFixed(2)}</td>
                <td>{item.quantity}</td>
                <td>${(item.book.price * item.quantity).toFixed(2)}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => removeFromCart(item.book.bookId)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4} className="text-end fw-bold">Total:</td>
              <td className="fw-bold">${total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      )}

      <button
        className="btn btn-outline-primary mt-3"
        onClick={() => navigate('/', { state: { page: returnPage, category: returnCategory } })}
      >
        ← Continue Shopping
      </button>
    </div>
  );
}

export default CartPage;