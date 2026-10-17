import { REVIEWS, RESTAURANT_INFO } from '../data/restaurantData';

export function ReviewsSection() {
  return (
    <section id="reviews" className="mt-8 sm:mt-space-3xl w-full max-w-full overflow-hidden flex flex-col gap-4 sm:gap-space-lg">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-space-md">
        <div>
          <span className="font-subheading-script text-xs sm:text-subheading-script text-secondary italic">
            What our diners say
          </span>
          <h2 className="font-headline-xl text-2xl sm:text-3xl md:text-headline-xl text-on-surface mt-0.5">Words from the Table</h2>
        </div>
        <div className="flex items-center gap-space-sm text-secondary">
          <span className="font-display-hero text-2xl sm:text-headline-xl text-primary font-bold">4.1</span>
          <div className="flex flex-col">
            <div className="flex">
              <span className="material-symbols-outlined text-[16px] sm:text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="material-symbols-outlined text-[16px] sm:text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="material-symbols-outlined text-[16px] sm:text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="material-symbols-outlined text-[16px] sm:text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="material-symbols-outlined text-[16px] sm:text-[18px]">star_half</span>
            </div>
            <span className="font-body-sm text-xs sm:text-body-sm text-tertiary">Over {RESTAURANT_INFO.reviewCount} reviews on Google</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
        {REVIEWS.map((review, idx) => (
          <div 
            key={review.id}
            className={`flex flex-col justify-between p-4 sm:p-space-lg rounded-xl bg-surface-container border border-surface-container-high/60 shadow-md hover:bg-surface-container-high transition-colors ${
              idx === 2 ? 'md:col-span-2 lg:col-span-1' : ''
            }`}
          >
            <div className="flex flex-col gap-2 sm:gap-space-sm">
              <div className="flex items-center justify-between">
                <div className="flex text-secondary">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-[16px] sm:text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                  ))}
                </div>
                <span className="text-[10px] sm:text-[11px] font-label-caps uppercase text-secondary/80 bg-surface-container-highest px-2 py-0.5 rounded">
                  {review.source}
                </span>
              </div>
              <p className="font-body-md text-xs sm:text-body-md text-on-surface leading-relaxed italic">
                "{review.text}"
              </p>
            </div>

            <div className="pt-3 sm:pt-space-md mt-3 sm:mt-space-md border-t border-surface-container-highest/60 flex items-center justify-between">
              <div>
                <span className="font-dish-title text-sm sm:text-dish-title text-on-surface font-semibold block">
                  {review.author}
                </span>
                <span className="font-body-sm text-xs sm:text-body-sm text-tertiary">
                  {review.role}
                </span>
              </div>
              <span className="font-body-sm text-xs sm:text-body-sm text-tertiary-fixed-dim">
                {review.date}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-space-xs px-2">
        <a 
          href={RESTAURANT_INFO.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-secondary text-xs sm:text-body-sm font-semibold border border-surface-container-high transition-colors max-w-full text-center"
        >
          <span className="material-symbols-outlined text-[16px] sm:text-[18px] shrink-0">open_in_new</span>
          <span>View Google Reviews</span>
        </a>
      </div>
    </section>
  );
}
