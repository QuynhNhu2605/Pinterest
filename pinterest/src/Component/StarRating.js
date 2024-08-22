import { FaStar } from 'react-icons/fa'; // Thêm thư viện react-icons để sử dụng icon ngôi sao

function StarRating({ rating }) {
  return (
    <div>
      {[...Array(5)].map((star, index) => (
        <FaStar
          key={index}
          color={index < rating ? "#ffc107" : "#e4e5e9"}
          size={20}
        />
      ))}
    </div>
  );
}
export default StarRating;