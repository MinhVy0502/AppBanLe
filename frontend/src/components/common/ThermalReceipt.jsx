import { formatPrice } from '../../utils/formatters';

export default function ThermalReceipt({ order, store }) {
  if (!order) return null;

  const items = order.items || order.cart || [];
  const createdAt = order.created_at ? new Date(order.created_at) : new Date();

  return (
    <div id="thermal-receipt" className="hidden">
      <div style={{ textAlign: 'center', marginBottom: '8px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 4px 0' }}>
          {store?.store_name || 'CỬA HÀNG BÁN LẺ'}
        </h2>
        <p style={{ margin: '0', fontSize: '11px' }}>HÓA ĐƠN BÁN HÀNG</p>
        <p style={{ margin: '2px 0 0 0', fontSize: '10px' }}>
          Mã ĐH: #{order.id || order.data?.id || 'POS'} | {createdAt.toLocaleDateString('vi-VN')} {createdAt.toLocaleTimeString('vi-VN')}
        </p>
      </div>

      <div style={{ borderTop: '1px dashed #000', borderBottom: '1px dashed #000', padding: '6px 0', margin: '6px 0' }}>
        <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left' }}>
              <th style={{ paddingBottom: '4px' }}>Mặt hàng</th>
              <th style={{ textAlign: 'center', paddingBottom: '4px' }}>SL</th>
              <th style={{ textAlign: 'right', paddingBottom: '4px' }}>T.Tiền</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx} style={{ verticalAlign: 'top' }}>
                <td style={{ padding: '2px 0' }}>
                  {item.product_name || item.product?.product_name}
                  {item.unit_name && <span style={{ fontSize: '9px' }}> ({item.unit_name})</span>}
                </td>
                <td style={{ textAlign: 'center', padding: '2px 0' }}>{item.quantity}</td>
                <td style={{ textAlign: 'right', padding: '2px 0' }}>
                  {formatPrice(item.price * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ fontSize: '11px', lineHeight: '1.6' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '13px' }}>
          <span>TỔNG TIỀN:</span>
          <span>{formatPrice(order.total_price || order.total || 0)}</span>
        </div>

        {order.payment_method && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
            <span>Hình thức:</span>
            <span>
              {order.payment_method === 'transfer' ? 'Chuyển khoản QR' : order.payment_method === 'debt' ? 'Mua chịu (Nợ)' : 'Tiền mặt'}
            </span>
          </div>
        )}

        {order.cash_received > 0 && order.payment_method === 'cash' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
              <span>Khách đưa:</span>
              <span>{formatPrice(order.cash_received)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: 'bold' }}>
              <span>Tiền thối:</span>
              <span>{formatPrice(order.change_amount || 0)}</span>
            </div>
          </>
        )}

        {order.customer && (
          <div style={{ marginTop: '4px', borderTop: '1px dotted #666', paddingTop: '4px', fontSize: '10px' }}>
            Khách hàng: {order.customer.customer_name} {order.customer.phone ? `(${order.customer.phone})` : ''}
          </div>
        )}
      </div>

      <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '10px', borderTop: '1px dashed #000', paddingTop: '6px' }}>
        <p style={{ margin: '0' }}>Cảm ơn quý khách và hẹn gặp lại!</p>
      </div>
    </div>
  );
}
