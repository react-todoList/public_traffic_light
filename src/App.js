import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [datas, setDatas] = useState([]); // 배열로 안 넣어주면 작동 안함
  const [isLoading, setIsLoading] = useState(true);

  const serviceKey = process.env.REACT_APP_PUBLIC_TRAFFIC_LIGHT_SERVICE_KEY;
  const rowNum = 10; // 10개씩 보여주기
  const [pageNo, setPageNo] = useState(1); // 첫 페이지 설정

  const [ref, inView] = useInView();

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `http://api.data.go.kr/openapi/tn_pubr_public_traffic_light_api?serviceKey=${serviceKey}&numOfRows=${rowNum}&pageNo=${pageNo}&type=json`
      );
      setDatas([...datas, ...res.data.response.body.items]);
      setPageNo((pageNo) => pageNo + 1);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // 초기 데이터 설정

  useEffect(() => {
    inView && fetchData();
  }, [inView]); // inview가 true일 때마다 fetchData 함수 호출

  return (
    <div className="App">
      {isLoading && <p>Loading ...</p>}
      {datas &&
        datas.map((item, index) => (
          <div ref={ref} className="box" key={index}>
            <p>주소: {item.lnmadr}</p>
            <p>신호등 색깔: {item.sgnaspOrdr}</p>
            <p>신호등 시간: {item.sgnaspTime}</p>
          </div>
        ))}
    </div>
  );
}

export default App;
