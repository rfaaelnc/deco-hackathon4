import type { ImageWidget } from 'apps/admin/widgets.ts';
import { useId } from '$store/sdk/useId.ts';
import { Picture, Source } from 'apps/website/components/Picture.tsx';

const script = (id: string) => {
  const callback = (e: Event) => {
    const KEY = 'store-popup';
    const VISIBLE = 'true';
    const HIDDEN = 'translate-y-[200%]';

    const popup = localStorage.getItem(KEY);
    const elem = document.getElementById(id);

    if (popup !== VISIBLE && elem) {
      const close = elem.querySelector('[data-button-cc-close]');
      close &&
        close.addEventListener('click', () => elem.classList.add(HIDDEN));
      elem.classList.remove(HIDDEN);
    }
  };

  const element = document.getElementById(id);

  if (element) {
    const type = element.dataset.type;
    const elementBody = document;

    if(type === 'in')
    addEventListener('scroll', callback, { once: true });

    if (elementBody !== null && type === 'out') {
      elementBody.addEventListener('mouseleave', callback, { once: true });
    }
  }
};

/**
 * @titleBy alt
 */
export interface Banner {
  /** @description Image optimized */
  image: ImageWidget;
  /** @description Image's alt text */
  alt: string;
  /** @description Popup de entrada ou saida */
  popup: 'in' | 'out';
  action?: {
    /** @description when user clicks on the image, go to this link */
    href: string;
    /** @description Image text title */
    title: string;
  };
}

export interface Props {
  banner?: Banner;
  layout?: {
    position?: 'Expanded' | 'Left' | 'Center' | 'Right';
    content?: 'Tiled' | 'Piled up';
  };
}

const DEFAULT_PROPS = {
  popup: 'in',
  layout: {
    position: 'Expanded',
    content: 'Tiled',
  },
  banner: {
    alt: 'popup promo',
    action: {
      href: 'https://www.deco.cx/',
      title: 'Demo Store',
    },
    image:
      'https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/239/ae89571c-4a7c-44bf-9aeb-a341fd049d19',
  },
};

function Popup(props: Props) {
  const id = useId();
  const { layout, banner, popup } = {
    ...DEFAULT_PROPS,
    ...props,
  };

  return (
    <>
      <div
        id={id}
        data-type={popup}
        class={`
          transform-gpu translate-y-[200%] transition fixed bottom-0 lg:bottom-2 w-screen z-50 lg:flex
          ${layout?.position === 'Left' ? 'lg:justify-start' : ''}
          ${layout?.position === 'Center' ? 'lg:justify-center' : ''}
          ${layout?.position === 'Right' ? 'lg:justify-end' : ''}
        `}
      >
        <div
          class={`
          mx-4 my-2 flex flex-col gap-4 shadow bg-base-100 rounded border border-base-200 relative
          ${
            !layout?.position || layout?.position === 'Expanded'
              ? 'lg:container lg:mx-auto'
              : `
            ${layout?.content === 'Piled up' ? 'lg:w-[480px]' : ''}
            ${
              !layout?.content || layout?.content === 'Tiled'
                ? 'lg:w-[520px]'
                : ''
            }
          `
          }
          ${
            !layout?.content || layout?.content === 'Tiled'
              ? 'lg:flex-row lg:items-end'
              : ''
          }
          
        `}
        >
          <button
            class="absolute right-0 top-0 btn btn-outline bg-white border-0 "
            data-button-cc-close
          >
            X
          </button>

          {banner.action?.href ? (
            <a href={banner.action.href} alt={banner.action.title}>
              <Picture preload={true}>
                <Source
                  media="(max-width: 767px)"
                  fetchPriority={'auto'}
                  src={banner.image}
                  width={440}
                  height={440}
                />
                <Source
                  media="(min-width: 768px)"
                  fetchPriority={'auto'}
                  src={banner.image}
                  width={640}
                  height={640}
                />
                <img
                  class="object-cover w-full h-full"
                  loading={'lazy'}
                  src={banner.image}
                  alt={banner.alt}
                />
              </Picture>
            </a>
          ) : (
            <Picture preload={true}>
              <Source
                media="(max-width: 767px)"
                fetchPriority={'auto'}
                src={banner.image}
                width={440}
                height={440}
              />
              <Source
                media="(min-width: 768px)"
                fetchPriority={'auto'}
                src={banner.image}
                width={640}
                height={640}
              />
              <img
                class="object-cover w-full h-full"
                loading={'lazy'}
                src={banner.image}
                alt={banner.alt}
              />
            </Picture>
          )}
        </div>
      </div>
      <script
        type="module"
        dangerouslySetInnerHTML={{ __html: `(${script})("${id}");` }}
      />
    </>
  );
}

export default Popup;
