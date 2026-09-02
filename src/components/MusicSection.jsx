import TrackCard from "./TrackCard";

export default function MusicSection({ tracks }) {
  return (
    <section id="music" className="relative py-24 px-5 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-display text-3xl md:text-4xl">موزیک‌ها</h2>
            <p className="text-bone/55 mt-2 text-sm">
              همه‌ی ترک‌های منتشر شده، به ترتیب جدیدترین
            </p>
          </div>
        </div>

        {tracks.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center text-bone/50">
            هنوز موزیکی منتشر نشده. به‌زودی برمی‌گردیم.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tracks.map((track) => (
              <TrackCard key={track.id} track={track} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
