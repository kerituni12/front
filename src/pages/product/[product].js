import ProductDetail from "@shop/Product/ProductDetail";
import api from "services/axios";

export default ProductDetail;

ProductDetail.getInitialProps = async ({ query }) => {
  try {
    const { data } = await api.get(`/api/product/${query.product}`);
    return { product: data.product, query };
  } catch (err) {
    // Hanlde typeError
    const { status, message } = err?.response?.data || { status: 500, message: "api errors" };
    return { error: { code: status, message: message } };
  }
};

// export async function getStaticProps({ params }) {
//   try {
//     const { data } = await api.get(`/api/product/${params.product}`)
//     return { props: { product: data.product, params } };
//   } catch (err) {
//     // Hanlde typeError
//     const { status, message } = err?.response?.data || { status: 500, message: "api errors" };
//     return { props: { error: { code: status, message: message } } };
//   }
// }

// export async function getStaticPaths() {
//   let { data } = await api.get(`/api/product`);

//   const paths = data.products.map((product) => ({
//     params: { product: product.slug },
//   }));

//   return { paths, fallback: false };
// }
