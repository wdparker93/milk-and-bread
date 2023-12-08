import "../css/LoadingResultsAnimation.css";

function LoadingResultsAnimation(params) {
  return (
    <>
      <div className="loading-spinner-content-wrapper">
        <div className="loading-spinner-text-wrapper">{params.loadingText}</div>
        <div className="loading-spinner-animation-wrapper">
          <img src="./media/Spin-1s-100px.gif" alt="Loading Spinner" />
        </div>
      </div>
    </>
  );
}

export default LoadingResultsAnimation;
