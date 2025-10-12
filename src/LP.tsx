export type LpType = {
  title: string;
  releaseDate: number;
  img: string;
  artist: string;
};

export const LP = ({ title, releaseDate, img, artist }: LpType) => {
  return (
    <div className="lp">
      <img src={img} alt={title} />
      <h2>{title}</h2>
      <h3>{artist}</h3>
      <p>{releaseDate}</p>
    </div>
  );
};
