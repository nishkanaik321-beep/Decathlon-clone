import './Stars.css';

export default function Stars({ value, size }) {
  const style = size ? { fontSize: size } : undefined;

  return (
    <span className="stars" style={style} aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= Math.round(value) ? 'on' : ''}>
          ★
        </span>
      ))}
    </span>
  );
}
