import React, { useEffect, useMemo, useState } from 'react'
import EditableImage from './EditableImage'
import NavbarAdmin from './NavbarAdmin'
import './AdminHomepageImages.css'

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'https://taras-kart-backend.vercel.app'

const DEFAULT_IMAGE_URLS = [
  '/images/banners/main-banner2.jpg',
  '/images/banners/mens-slide3.jpg',
  '/images/banners/womens-slide3.jpg',
  '/images/banners/category1.avif',
  '/images/banners/category2.avif',
  '/images/banners/category3.avif',
  '/images/banners/category4.avif',
  '/images/banners/category5.avif',
  '/images/banners/women-category-anarkali.png',
  '/images/banners/women-category-halfsaree.png',
  '/images/banners/women-category-punjabi.png',
  '/images/banners/women-category-saree.png',
  '/images/women/women11.jpeg',
  '/images/women/women12.jpeg',
  '/images/women/women13.jpeg',
  '/images/men/mens1.jpeg',
  '/images/men/mens2.jpeg',
  '/images/men/mens3.jpeg',
  '/images/kids/kids-formal.jpg',
  '/images/kids/kids16.jpeg',
  '/images/kids/kids17.jpeg',
  '/images/banners/banner1.jpg',
  '/images/banners/banner2.jpg',
  '/images/banners/banner3.jpg',
  '/images/banners/banner4.png',
  '/images/banners/banner5.png',
  '/images/banners/banner6.png',
  '/images/banners/banner7.png',
  '/images/banners/banner8.png',
  '/images/banners/banner9.png',
  '/images/women/new/category9.png',
  '/images/women/new/category10.png',
  '/images/women/new/category11.png',
  '/images/women/new/category12.png',
  '/images/women/new/category13.png',
  '/images/women/new/category14.png',
  '/images/women/new/category15.png',
  '/images/women/new/category16.png',
  '/images/women/new/category-1.png',
  '/images/women/new/category-2.png',
  '/images/women/new/category-3.png',
  '/images/women/new/category-4.png',
  '/images/women/new/category-5.png',
  '/images/women/new/category-6.png',
  '/images/women/new/category-7.png',
  '/images/women/new/category-8.png',
  '/images/women/new/zig-zag1.png',
  '/images/women/new/zig-zag2.png',
  '/images/women/new/zig-zag3.png',
  '/images/women/new/zig-zag4.png',
  '/images/women/new/zig-zag5.png',
  '/images/women/new/roll1.png',
  '/images/women/new/roll2.png',
  '/images/women/new/roll3.png',
  '/images/women/new/roll4.png',
  '/images/women/new/main-card.png',
  '/images/women/new/roll5.png',
  '/images/women/new/roll6.png',
  '/images/women/new/pin1.jpg',
  '/images/women/new/roll8.jpg',
  '/images/men/men-ct-1.png',
  '/images/men/men-ct-2.png',
  '/images/men/men-ct-3.png',
  '/images/men/men-ct-4.png',
  '/images/men/men-ct-5.png',
  '/images/men/men-ct-6.png',
  '/images/men/men-ct-7.png'
]

function deriveSectionFromPath(path) {
  if (path.includes('main-banner2') || path.includes('mens-slide3') || path.includes('womens-slide3')) {
    return 'hero-top'
  }
  if (path.includes('/banners/banner1') || path.includes('/banners/banner2') || path.includes('/banners/banner3')) {
    return 'hero-mid-1'
  }
  if (path.includes('/banners/banner4') || path.includes('/banners/banner5') || path.includes('/banners/banner6')) {
    return 'hero-mid-2'
  }
  if (path.includes('/banners/banner7') || path.includes('/banners/banner8') || path.includes('/banners/banner9')) {
    return 'hero-mid-3'
  }
  if (path.includes('/banners/category')) {
    return 'category-row'
  }
  if (path.includes('women-category-')) {
    return 'shop-by-category'
  }
  if (path.includes('/women/women')) {
    return 'trending-women'
  }
  if (path.includes('/men/mens')) {
    return 'trending-men'
  }
  if (path.includes('/kids/')) {
    return 'trending-kids'
  }
  if (path.includes('/women/new/category-')) {
    return 'women-twinbirds-icons'
  }
  if (path.includes('/women/new/category') && !path.includes('category-')) {
    return 'women-categories-grid'
  }
  if (path.includes('zig-zag')) {
    return 'women-indian-flower'
  }
  if (path.includes('/women/new/roll') || path.includes('main-card') || path.includes('pin1')) {
    return 'women-innerwear'
  }
  if (path.includes('men-ct-')) {
    return 'men-collections'
  }
  return 'other'
}

function deriveAltFromPath(path) {
  const parts = path.split('/')
  const file = parts[parts.length - 1] || ''
  const base = file.split('.')[0] || ''
  return base.replace(/[-_]+/g, ' ').trim() || 'Image'
}

const SECTION_META = {
  'hero-top': {
    title: 'Hero Slider (Top)',
    description: 'Main homepage hero banners at the top.',
    gridClass: 'admin-image-grid-hero'
  },
  'hero-mid-1': {
    title: 'Middle Banner Slider 1',
    description: 'First mid-page banner slider.',
    gridClass: 'admin-image-grid-hero'
  },
  'hero-mid-2': {
    title: 'Middle Banner Slider 2',
    description: 'Second mid-page banner slider.',
    gridClass: 'admin-image-grid-hero'
  },
  'hero-mid-3': {
    title: 'Bottom Banner Slider',
    description: 'Bottom hero-style banners.',
    gridClass: 'admin-image-grid-hero'
  },
  'category-row': {
    title: 'Category Row',
    description: 'Category tiles under the main hero.',
    gridClass: 'admin-image-grid-categories'
  },
  'shop-by-category': {
    title: 'Shop by Category',
    description: 'Women category tiles like Anarkali, Half Saree, Punjabi, Saree.',
    gridClass: 'admin-image-grid-women-category'
  },
  'trending-women': {
    title: 'Trending Now • Women',
    description: 'Women images in the trending mosaic.',
    gridClass: 'admin-image-grid-women-grid'
  },
  'trending-men': {
    title: 'Trending Now • Men',
    description: 'Men images in the trending mosaic.',
    gridClass: 'admin-image-grid-women-grid'
  },
  'trending-kids': {
    title: 'Trending Now • Kids',
    description: 'Kids images in the trending mosaic.',
    gridClass: 'admin-image-grid-women-grid'
  },
  'women-categories-grid': {
    title: 'Women’s Categories Grid',
    description: 'Women’s category cards like leggings, tops, lounge wear.',
    gridClass: 'admin-image-grid-women-grid'
  },
  'women-twinbirds-icons': {
    title: 'Women • Twin Birds Row',
    description: 'Twin Birds category icons row and belts.',
    gridClass: 'admin-image-grid-women-grid'
  },
  'women-indian-flower': {
    title: 'Women • Indian Flower Grid',
    description: 'Zig-zag Indian Flower category layout.',
    gridClass: 'admin-image-grid-women-grid'
  },
  'women-innerwear': {
    title: 'Women • Innerwear',
    description: 'Innerwear grid including Intimacy, Naidu Hall, Aswathi and shapers.',
    gridClass: 'admin-image-grid-women-grid'
  },
  'men-collections': {
    title: 'Men • Collections and Essentials',
    description: 'Men collection circles and essential grids.',
    gridClass: 'admin-image-grid-women-grid'
  },
  other: {
    title: 'Other Homepage Images',
    description: 'Any remaining homepage images.',
    gridClass: 'admin-image-grid-women-grid'
  }
}

const SECTION_ORDER = [
  'hero-top',
  'hero-mid-1',
  'hero-mid-2',
  'hero-mid-3',
  'category-row',
  'shop-by-category',
  'trending-women',
  'trending-men',
  'trending-kids',
  'women-categories-grid',
  'women-twinbirds-icons',
  'women-indian-flower',
  'women-innerwear',
  'men-collections',
  'other'
]

export default function AdminHomepageImages() {
  const [remoteMap, setRemoteMap] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const run = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/homepage-images`, { cache: 'no-store' })
        if (res.status === 304) {
          if (isMounted) setLoading(false)
          return
        }
        if (!res.ok) {
          if (isMounted) setLoading(false)
          return
        }
        const data = await res.json()
        const map = {}
        data.forEach(item => {
          map[item.id] = item
        })
        if (isMounted) {
          setRemoteMap(map)
          setLoading(false)
        }
      } catch (e) {
        if (isMounted) setLoading(false)
      }
    }
    run()
    return () => {
      isMounted = false
    }
  }, [])

  const slots = useMemo(() => {
    const baseSlots = DEFAULT_IMAGE_URLS.map(url => {
      const section = deriveSectionFromPath(url)
      const baseAlt = deriveAltFromPath(url)
      const remote = remoteMap[url]
      return {
        id: url,
        section,
        defaultUrl: url,
        imageUrl: remote && remote.imageUrl ? remote.imageUrl : url,
        altText: remote && remote.altText ? remote.altText : baseAlt
      }
    })

    const extraSlots = Object.values(remoteMap)
      .filter(item => !DEFAULT_IMAGE_URLS.includes(item.id))
      .map(item => {
        const section = item.section || deriveSectionFromPath(item.id || '')
        const baseAlt = item.altText || deriveAltFromPath(item.id || '')
        const defaultUrl = item.id && item.id.startsWith('/images/') ? item.id : item.imageUrl
        return {
          id: item.id,
          section,
          defaultUrl: defaultUrl || item.imageUrl,
          imageUrl: item.imageUrl,
          altText: baseAlt
        }
      })

    return [...baseSlots, ...extraSlots]
  }, [remoteMap])

  const sectionsMap = useMemo(() => {
    const map = {}
    slots.forEach(slot => {
      const key = slot.section || 'other'
      if (!map[key]) map[key] = []
      map[key].push(slot)
    })
    return map
  }, [slots])

  const handleUpdated = updated => {
    setRemoteMap(prev => ({
      ...prev,
      [updated.id]: updated
    }))
  }

  if (loading) {
    return (
      <>
        <NavbarAdmin />
        <div className="admin-homepage-wrapper">
          <div className="admin-homepage-header">
            <h1 className="admin-homepage-title">Homepage Images</h1>
            <p className="admin-homepage-subtitle">Loading images...</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <NavbarAdmin />
      <div className="admin-homepage-wrapper">
        <div className="admin-homepage-header">
          <h1 className="admin-homepage-title">Homepage Images</h1>
          <p className="admin-homepage-subtitle">
            Hover on any image to replace it. If there is no saved image, the default website image is shown.
          </p>
        </div>

        {SECTION_ORDER.map(key => {
          const items = sectionsMap[key]
          if (!items || !items.length) return null
          const meta = SECTION_META[key] || SECTION_META.other
          const gridClass = meta.gridClass || ''
          return (
            <section key={key} className="admin-section">
              <div className="admin-section-head">
                <h2 className="admin-section-title">{meta.title}</h2>
                {meta.description && (
                  <p className="admin-section-description">{meta.description}</p>
                )}
              </div>
              <div className={`admin-image-grid ${gridClass}`}>
                {items.map(slot => (
                  <div key={slot.id} className="admin-image-card">
                    <EditableImage
                      slotId={slot.id}
                      section={slot.section}
                      imageUrl={slot.imageUrl}
                      defaultUrl={slot.defaultUrl}
                      altText={slot.altText}
                      onUpdated={handleUpdated}
                    />
                    <div className="admin-image-label">{slot.altText}</div>
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </>
  )
}
