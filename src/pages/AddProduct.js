import React, { useState } from 'react';
import './AddProduct.css';
const portalClass = value => String(value || '').split(/\s+/).filter(Boolean).flatMap(name => ({
  "ops-main": ["tsup-operations-ops-main"],
  "ops-heading": ["tsup-operations-ops-heading"],
  "ops-panel": ["tsup-operations-ops-panel"],
  "ops-actions": ["tsup-operations-ops-actions"],
  "ops-row-actions": ["tsup-operations-ops-row-actions"],
  "ops-primary": ["tsup-operations-ops-primary"],
  "ops-metrics": ["tsup-operations-ops-metrics"],
  "ops-quick": ["tsup-operations-ops-quick"],
  "ops-table-wrap": ["tsup-operations-ops-table-wrap"],
  "ops-badge": ["tsup-operations-ops-badge"],
  "ops-toolbar": ["tsup-operations-ops-toolbar"],
  "ops-dates": ["tsup-operations-ops-dates"],
  "ops-pagination": ["tsup-operations-ops-pagination"],
  "ops-alert": ["tsup-operations-ops-alert"],
  "ops-success": ["tsup-operations-ops-success"],
  "ops-empty": ["tsup-operations-ops-empty"],
  "ops-overlay": ["tsup-operations-ops-overlay"],
  "ops-modal": ["tsup-operations-ops-modal"],
  "ops-form": ["tsup-operations-ops-form"],
  "ops-form-grid": ["tsup-operations-ops-form-grid"],
  "ops-nav": ["tsup-operations-ops-nav"],
  "ops-nav-top": ["tsup-operations-ops-nav-top"],
  "ops-brand": ["tsup-operations-ops-brand"],
  "ops-nav-controls": ["tsup-operations-ops-nav-controls"],
  "ops-nav-links": ["tsup-operations-ops-nav-links"],
  "ops-mobile-toggle": ["tsup-operations-ops-mobile-toggle"],
  "ops-pos-grid": ["tsup-operations-ops-pos-grid"],
  "ops-pos-total": ["tsup-operations-ops-pos-total"],
  "ops-pos-qty": ["tsup-operations-ops-pos-qty"],
  "ops-danger": ["tsup-operations-ops-danger"],
  "ops-password": ["tsup-operations-ops-password"],
  "add-product-page": ["tsup-addproduct-add-product-page"],
  "admin-section1": ["tsup-addproduct-admin-section1"],
  "admin-section2": ["tsup-addproduct-admin-section2"],
  "category-buttons": ["tsup-addproduct-category-buttons"],
  "active": ["tsup-addproduct-active"],
  "brand-search": ["tsup-addproduct-brand-search"],
  "brand-dropdown": ["tsup-addproduct-brand-dropdown"],
  "brand-item": ["tsup-addproduct-brand-item"],
  "add-new-brand-button": ["tsup-addproduct-add-new-brand-button"],
  "popup-overlay": ["tsup-addproduct-popup-overlay"],
  "popup-box": ["tsup-addproduct-popup-box"],
  "popup-actions": ["tsup-addproduct-popup-actions"],
  "admin-section3": ["tsup-addproduct-admin-section3"],
  "admin-section4-final": ["tsup-addproduct-admin-section4-final"],
  "section4-left-final": ["tsup-addproduct-section4-left-final"],
  "section4-right-final": ["tsup-addproduct-section4-right-final"],
  "section4-heading-final": ["tsup-addproduct-section4-heading-final"],
  "color-grid-final": ["tsup-addproduct-color-grid-final"],
  "color-item-final": ["tsup-addproduct-color-item-final"],
  "active-final": ["tsup-addproduct-active-final"],
  "color-swatch-final": ["tsup-addproduct-color-swatch-final"],
  "size-section-final": ["tsup-addproduct-size-section-final"],
  "sub-heading-final": ["tsup-addproduct-sub-heading-final"],
  "size-grid-final": ["tsup-addproduct-size-grid-final"],
  "size-box-final": ["tsup-addproduct-size-box-final"],
  "price-inputs-final": ["tsup-addproduct-price-inputs-final"],
  "price-table-scope-final": ["tsup-addproduct-price-table-scope-final"],
  "price-table-final": ["tsup-addproduct-price-table-final"],
  "centered-input-final": ["tsup-addproduct-centered-input-final"],
  "image-upload-container-final": ["tsup-addproduct-image-upload-container-final"],
  "upload-btn-final": ["tsup-addproduct-upload-btn-final"],
  "preview-image-final": ["tsup-addproduct-preview-image-final"],
  "admin-section5": ["tsup-addproduct-admin-section5"],
  "add-product-final-btn": ["tsup-addproduct-add-product-final-btn"],
  "popup-card": ["tsup-addproduct-popup-card"],
  "success": ["tsup-addproduct-success"],
  "error": ["tsup-addproduct-error"]
})[name] || ["tsup-addproduct-" + name]).join(' ');
const DEFAULT_API_BASE = 'https://taras-kart-backend.vercel.app';
const DEFAULT_ASSETS_BASE = 'https://taras-kart-backend.vercel.app/uploads';
const API_BASE_RAW = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) || (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE) || DEFAULT_API_BASE;
const ASSETS_BASE_RAW = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_ASSETS_BASE) || (typeof process !== 'undefined' && process.env && process.env.REACT_APP_ASSETS_BASE) || DEFAULT_ASSETS_BASE;
const API_BASE = API_BASE_RAW.replace(/\/+$/, '');
const ASSETS_BASE = ASSETS_BASE_RAW.replace(/\/+$/, '');
const AddProduct = () => {
  const [brandList, setBrandList] = useState(['Nike', 'Adidas', 'Puma', 'Reebok', 'Under Armour', 'New Balance', 'Asics', 'Skechers', 'Fila', 'Converse', 'Vans', 'Jordan', "Levi's", 'Zara', 'H&M', 'Gucci', 'Prada', 'Balenciaga', 'Chanel', 'Burberry', 'Lacoste', 'Tommy Hilfiger', 'Diesel', 'Armani', 'Calvin Klein', 'Versace', 'Louis Vuitton', 'Guess', 'Hugo Boss', 'Patagonia']);
  const [productList, setProductList] = useState(['Indian Women Fashion', 'Men Urban Style', 'Kids Wear', 'Office Formal Wear', 'Ethnic Kurti', 'Designer Saree', 'Traditional Sherwani', 'Boy T-Shirts', 'Girl Party Dresses', 'Activewear', 'Winter Jackets', 'Summer Shorts', 'Casual Shirts', 'Denim Jeans', 'Churidar Set', 'Printed Dupatta', 'Skater Skirts', 'Floral Blouses', 'Co-ord Sets', 'Athleisure Track', 'Sports Tees', 'Sweatshirts', 'School Uniforms', 'Gowns', 'Daily Cotton Wear', 'Festive Lehenga', 'Jumpsuits', 'Cargo Pants', 'Graphic Tees', 'Layered Hoodies']);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [brandInput, setBrandInput] = useState('');
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [showDropdownBrand, setShowDropdownBrand] = useState(false);
  const [showPopupBrand, setShowPopupBrand] = useState(false);
  const [newBrand, setNewBrand] = useState('');
  const [productInput, setProductInput] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showDropdownProduct, setShowDropdownProduct] = useState(false);
  const [showPopupProduct, setShowPopupProduct] = useState(false);
  const [newProduct, setNewProduct] = useState('');
  const [identifierMode, setIdentifierMode] = useState('ean');
  const [eanCode, setEanCode] = useState('');
  const [patternCode, setPatternCode] = useState('');
  const [originalPriceB2B, setOriginalPriceB2B] = useState('');
  const [discountB2B, setDiscountB2B] = useState('');
  const [finalPriceB2B, setFinalPriceB2B] = useState('');
  const [originalPriceB2C, setOriginalPriceB2C] = useState('');
  const [discountB2C, setDiscountB2C] = useState('');
  const [finalPriceB2C, setFinalPriceB2C] = useState('');
  const [totalCount, setTotalCount] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [colors, setColors] = useState(['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White', 'Purple', 'Pink', 'Orange', 'Brown', 'Grey', 'Maroon', 'Navy', 'Olive', 'Teal', 'Cyan', 'Magenta', 'Beige', 'Lavender', 'Gold']);
  const [customColorInput, setCustomColorInput] = useState('');
  const handlePriceChangeB2B = value => {
    setOriginalPriceB2B(value);
    const price = parseFloat(value);
    const disc = parseFloat(discountB2B);
    if (!isNaN(price) && !isNaN(disc)) {
      setFinalPriceB2B((price - price * disc / 100).toFixed(2));
    }
  };
  const handleDiscountChangeB2B = value => {
    setDiscountB2B(value);
    const price = parseFloat(originalPriceB2B);
    const disc = parseFloat(value);
    if (!isNaN(price) && !isNaN(disc)) {
      setFinalPriceB2B((price - price * disc / 100).toFixed(2));
    }
  };
  const handlePriceChangeB2C = value => {
    setOriginalPriceB2C(value);
    const price = parseFloat(value);
    const disc = parseFloat(discountB2C);
    if (!isNaN(price) && !isNaN(disc)) {
      setFinalPriceB2C((price - price * disc / 100).toFixed(2));
    }
  };
  const handleDiscountChangeB2C = value => {
    setDiscountB2C(value);
    const price = parseFloat(originalPriceB2C);
    const disc = parseFloat(value);
    if (!isNaN(price) && !isNaN(disc)) {
      setFinalPriceB2C((price - price * disc / 100).toFixed(2));
    }
  };
  const normalizeAssetUrl = maybeRelative => {
    if (!maybeRelative) return '';
    if (/^https?:\/\//i.test(maybeRelative)) return maybeRelative;
    const base = ASSETS_BASE || API_BASE;
    if (!base) return maybeRelative;
    const needsSlash = !maybeRelative.startsWith('/');
    return `${base}${needsSlash ? '/' : ''}${maybeRelative}`;
  };
  const handleImageUpload = async e => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        body: formData
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Upload failed (${res.status}): ${text.slice(0, 200)}`);
      }
      const data = await res.json();
      const url = normalizeAssetUrl(data.imageUrl || data.url || data.path);
      setUploadedImage(url);
    } catch (err) {
      console.error('Image upload failed:', err);
    }
  };
  const colorMap = {
    Red: '#FF0000',
    Blue: '#0000FF',
    Green: '#008000',
    Yellow: '#FFFF00',
    Black: '#000000',
    White: '#FFFFFF',
    Purple: '#800080',
    Pink: '#FFC0CB',
    Orange: '#FFA500',
    Brown: '#A52A2A',
    Grey: '#808080',
    Maroon: '#800000',
    Navy: '#000080',
    Olive: '#808000',
    Teal: '#008080',
    Cyan: '#00FFFF',
    Magenta: '#FF00FF',
    Beige: '#F5F5DC',
    Lavender: '#E6E6FA',
    Gold: '#FFD700'
  };
  const kidsSizes = ['Below 1 year', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9', '9-10', '10-11', '11-12', '12-13', '13-14', '14-15'];
  const adultSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XXXLL'];
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('');
  const handleAddProduct = async () => {
    const ean = identifierMode === 'ean' ? eanCode.trim() : patternCode.trim();
    if (identifierMode === 'ean') {
      if (!/^[0-9]{12,14}$/.test(ean)) {
        setPopupMessage('EAN code must be 12–14 digits.');
        setPopupType('error');
        setTimeout(() => {
          setPopupMessage('');
          setPopupType('');
        }, 3000);
        return;
      }
    } else {
      if (!ean) {
        setPopupMessage('Pattern code cannot be empty.');
        setPopupType('error');
        setTimeout(() => {
          setPopupMessage('');
          setPopupType('');
        }, 3000);
        return;
      }
    }
    if (!selectedCategory || !brandInput || !productInput || !selectedColor || !selectedSize || !originalPriceB2B || !discountB2B || !finalPriceB2B || !originalPriceB2C || !discountB2C || !finalPriceB2C || !uploadedImage) {
      setPopupMessage('Please fill all the required fields.');
      setPopupType('error');
    } else {
      const productData = {
        category: selectedCategory,
        brand: brandInput,
        product_name: productInput,
        color: selectedColor,
        size: selectedSize,
        ean_code: ean,
        original_price_b2b: parseFloat(originalPriceB2B),
        discount_b2b: parseFloat(discountB2B),
        final_price_b2b: parseFloat(finalPriceB2B),
        original_price_b2c: parseFloat(originalPriceB2C),
        discount_b2c: parseFloat(discountB2C),
        final_price_b2c: parseFloat(finalPriceB2C),
        total_count: parseInt(totalCount),
        image_url: uploadedImage
      };
      try {
        const res = await fetch(`${API_BASE}/api/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(productData)
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Create failed (${res.status}): ${text.slice(0, 200)}`);
        }
        await res.json();
        setPopupMessage('Product added successfully!');
        setPopupType('success');
        setSelectedCategory('');
        setBrandInput('');
        setProductInput('');
        setSelectedColor('');
        setSelectedSize('');
        setOriginalPriceB2B('');
        setDiscountB2B('');
        setFinalPriceB2B('');
        setOriginalPriceB2C('');
        setDiscountB2C('');
        setFinalPriceB2C('');
        setTotalCount('');
        setUploadedImage(null);
        setEanCode('');
        setPatternCode('');
        setIdentifierMode('ean');
      } catch (error) {
        console.error('Error:', error);
        setPopupMessage('Failed to add product.');
        setPopupType('error');
      }
    }
    setTimeout(() => {
      setPopupMessage('');
      setPopupType('');
    }, 3000);
  };
  const handleCategorySelect = category => {
    setSelectedCategory(category);
  };
  const handleBrandSearch = e => {
    const value = e.target.value;
    setBrandInput(value);
    setShowDropdownBrand(true);
    const filtered = brandList.filter(brand => brand.toLowerCase().includes(value.toLowerCase()));
    setFilteredBrands(filtered);
  };
  const handleBrandSelect = brand => {
    setBrandInput(brand);
    setShowDropdownBrand(false);
  };
  const handleAddNewBrand = () => {
    if (newBrand.trim() && !brandList.includes(newBrand)) {
      const updatedList = [...brandList, newBrand];
      setBrandList(updatedList);
      setFilteredBrands(updatedList);
      setBrandInput(newBrand);
    }
    setNewBrand('');
    setShowPopupBrand(false);
    setShowDropdownBrand(false);
  };
  const handleAddCustomColor = () => {
    const value = customColorInput.trim();
    if (value && !colors.includes(value)) {
      setColors([...colors, value]);
    }
    if (value) setSelectedColor(value);
    setCustomColorInput('');
  };
  const handleProductSearch = e => {
    const value = e.target.value;
    setProductInput(value);
    setShowDropdownProduct(true);
    const filtered = productList.filter(product => product.toLowerCase().includes(value.toLowerCase()));
    setFilteredProducts(filtered);
  };
  const handleProductSelect = product => {
    setProductInput(product);
    setShowDropdownProduct(false);
  };
  const handleAddNewProduct = () => {
    if (newProduct.trim() && !productList.includes(newProduct)) {
      const updatedList = [...productList, newProduct];
      setProductList(updatedList);
      setFilteredProducts(updatedList);
      setProductInput(newProduct);
    }
    setNewProduct('');
    setShowPopupProduct(false);
    setShowDropdownProduct(false);
  };
  return <div className={portalClass("add-product-page")}>
            <div className={portalClass("admin-section1")}>
                <h2 className="tsup-addproduct-node-0">Category</h2>
                <div className={portalClass("category-buttons")}>
                    {['Men', 'Women', 'Kids - Boys', 'Kids - Girls'].map(category => <button key={category} className={portalClass(selectedCategory === category ? 'active' : '')} onClick={() => handleCategorySelect(category)}>
                            {category}
                        </button>)}
                </div>
            </div>

            <div className={portalClass("admin-section2")}>
                <h2 className="tsup-addproduct-node-1">Add Brand</h2>
                <input type="text" placeholder="Search brand" value={brandInput} onChange={handleBrandSearch} onFocus={() => {
        const filtered = brandList.filter(brand => brand.toLowerCase().includes(brandInput.toLowerCase()));
        setFilteredBrands(filtered);
        setShowDropdownBrand(true);
      }} className={portalClass("brand-search")} />
                {showDropdownBrand && <div className={portalClass("brand-dropdown")}>
                        {filteredBrands.map(brand => <div key={brand} className={portalClass("brand-item")} onClick={() => handleBrandSelect(brand)}>
                                {brand}
                            </div>)}
                    </div>}
                <button className={portalClass("add-new-brand-button")} onClick={() => setShowPopupBrand(true)}>
                    Add New Brand
                </button>
            </div>

            <div className={portalClass("admin-section3")}>
                <h2 className="tsup-addproduct-node-2">Add Product Name</h2>
                <input type="text" placeholder="Search product" value={productInput} onChange={handleProductSearch} onFocus={() => {
        const filtered = productList.filter(product => product.toLowerCase().includes(productInput.toLowerCase()));
        setFilteredProducts(filtered);
        setShowDropdownProduct(true);
      }} className={portalClass("brand-search")} />
                {showDropdownProduct && <div className={portalClass("brand-dropdown")}>
                        {filteredProducts.map(product => <div key={product} className={portalClass("brand-item")} onClick={() => handleProductSelect(product)}>
                                {product}
                            </div>)}
                    </div>}
                <button className={portalClass("add-new-brand-button")} onClick={() => setShowPopupProduct(true)}>
                    Add New Product
                </button>
            </div>

            {showPopupBrand && <div className={portalClass("popup-overlay")}>
                    <div className={portalClass("popup-box")}>
                        <h3 className="tsup-addproduct-node-3">Add a New Brand</h3>
                        <input type="text" placeholder="Enter new brand name" value={newBrand} onChange={e => setNewBrand(e.target.value)} className="tsup-addproduct-node-4" />
                        <div className={portalClass("popup-actions")}>
                            <button onClick={handleAddNewBrand} className="tsup-addproduct-node-5">Add Brand</button>
                            <button onClick={() => setShowPopupBrand(false)} className="tsup-addproduct-node-6">Cancel</button>
                        </div>
                    </div>
                </div>}

            {showPopupProduct && <div className={portalClass("popup-overlay")}>
                    <div className={portalClass("popup-box")}>
                        <h3 className="tsup-addproduct-node-7">Add a New Product</h3>
                        <input type="text" placeholder="Enter new product name" value={newProduct} onChange={e => setNewProduct(e.target.value)} className="tsup-addproduct-node-8" />
                        <div className={portalClass("popup-actions")}>
                            <button onClick={handleAddNewProduct} className="tsup-addproduct-node-9">Add Product</button>
                            <button onClick={() => setShowPopupProduct(false)} className="tsup-addproduct-node-10">Cancel</button>
                        </div>
                    </div>
                </div>}

            <div className={portalClass("admin-section4-final")}>
                <div className={portalClass("section4-left-final")}>

                    {}
                    <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '15px'
        }} className="tsup-addproduct-node-11">
                        <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            color: "#42536a",
            fontSize: '14px',
            fontWeight: 'bold'
          }} className="tsup-addproduct-node-12">
                            <input type="radio" name="identifierMode" value="ean" checked={identifierMode === 'ean'} onChange={() => setIdentifierMode('ean')} className="tsup-addproduct-node-13" />
                            EAN Code
                        </label>
                        <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            color: "#42536a",
            fontSize: '14px',
            fontWeight: 'bold'
          }} className="tsup-addproduct-node-14">
                            <input type="radio" name="identifierMode" value="pattern" checked={identifierMode === 'pattern'} onChange={() => setIdentifierMode('pattern')} className="tsup-addproduct-node-15" />
                            Pattern Code
                        </label>
                    </div>

                    <div style={{
          marginBottom: '20px'
        }} className="tsup-addproduct-node-16">
                        {identifierMode === 'ean' ? <>
                                <div className={portalClass("section4-heading-final")}>EAN Code</div>
                                <input type="text" className={portalClass("brand-search")} placeholder="13 digit EAN code" value={eanCode} onChange={e => setEanCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 13))} />
                                <span style={{
              fontSize: '12px',
              color: "#42536a",
              display: 'block',
              marginTop: '4px'
            }} className="tsup-addproduct-node-17">Must be exactly 13 digits</span>
                            </> : <>
                                <div className={portalClass("section4-heading-final")}>Pattern Code</div>
                                <input type="text" className={portalClass("brand-search")} placeholder="Any pattern/style code e.g. CA01, DEFM, F909" value={patternCode} onChange={e => setPatternCode(e.target.value)} />
                                <span style={{
              fontSize: '12px',
              color: "#42536a",
              display: 'block',
              marginTop: '4px'
            }} className="tsup-addproduct-node-18">Any format — letters, numbers, no length restriction</span>
                            </>}
                    </div>

                    {}
                    <div className={portalClass("section4-heading-final")}>Color</div>
                    <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '12px'
        }} className="tsup-addproduct-node-19">
                        <input type="text" className={portalClass("brand-search")} placeholder="Type a colour name" value={customColorInput} onChange={e => setCustomColorInput(e.target.value)} onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddCustomColor();
            }
          }} />
                        <button type="button" className={portalClass("add-new-brand-button")} onClick={handleAddCustomColor}>
                            Add
                        </button>
                    </div>
                    <div className={portalClass("color-grid-final")}>
                        {colors.map(color => <div className={portalClass(`color-item-final ${selectedColor === color ? 'active-final' : ''}`)} key={color} onClick={() => setSelectedColor(color)}>
                                <div className={portalClass("color-swatch-final")} style={{
              backgroundColor: colorMap[color] || '#999999'
            }}></div>
                                {color}
                            </div>)}
                    </div>

                    <div className={portalClass("section4-heading-final")}>Size</div>
                    <div className={portalClass("size-section-final")}>
                        <div className={portalClass("sub-heading-final")}>Kids</div>
                        <div className={portalClass("size-grid-final")}>
                            {kidsSizes.map(size => <div className={portalClass(`size-box-final ${selectedSize === size ? 'active-final' : ''}`)} key={size} onClick={() => setSelectedSize(size)}>
                                    {size}
                                </div>)}
                        </div>
                        <div className={portalClass("sub-heading-final")}>Adults</div>
                        <div className={portalClass("size-grid-final")}>
                            {adultSizes.map(size => <div className={portalClass(`size-box-final ${selectedSize === size ? 'active-final' : ''}`)} key={size} onClick={() => setSelectedSize(size)}>
                                    {size}
                                </div>)}
                        </div>
                    </div>

                    <div className={portalClass("price-inputs-final")}>
                        <div className={portalClass("price-table-scope-final")}>
                            <table className={portalClass("price-table-final")}>
                                <thead className="tsup-addproduct-node-20">
                                    <tr className="tsup-addproduct-node-21">
                                        <th className="tsup-addproduct-node-22"></th>
                                        <th className="tsup-addproduct-node-23">B2B</th>
                                        <th className="tsup-addproduct-node-24">B2C</th>
                                    </tr>
                                </thead>
                                <tbody className="tsup-addproduct-node-25">
                                    <tr className="tsup-addproduct-node-26">
                                        <td className="tsup-addproduct-node-27">Original Price</td>
                                        <td className="tsup-addproduct-node-28">
                                            <input type="number" value={originalPriceB2B} onChange={e => handlePriceChangeB2B(e.target.value)} className="tsup-addproduct-node-29" />
                                        </td>
                                        <td className="tsup-addproduct-node-30">
                                            <input type="number" value={originalPriceB2C} onChange={e => handlePriceChangeB2C(e.target.value)} className="tsup-addproduct-node-31" />
                                        </td>
                                    </tr>
                                    <tr className="tsup-addproduct-node-32">
                                        <td className="tsup-addproduct-node-33">Discount (%)</td>
                                        <td className="tsup-addproduct-node-34">
                                            <input type="number" value={discountB2B} onChange={e => handleDiscountChangeB2B(e.target.value)} className="tsup-addproduct-node-35" />
                                        </td>
                                        <td className="tsup-addproduct-node-36">
                                            <input type="number" value={discountB2C} onChange={e => handleDiscountChangeB2C(e.target.value)} className="tsup-addproduct-node-37" />
                                        </td>
                                    </tr>
                                    <tr className="tsup-addproduct-node-38">
                                        <td className="tsup-addproduct-node-39">Final Price</td>
                                        <td className="tsup-addproduct-node-40">
                                            <input type="number" value={finalPriceB2B} readOnly className="tsup-addproduct-node-41" />
                                        </td>
                                        <td className="tsup-addproduct-node-42">
                                            <input type="number" value={finalPriceB2C} readOnly className="tsup-addproduct-node-43" />
                                        </td>
                                    </tr>
                                    <tr className="tsup-addproduct-node-44">
                                        <td className="tsup-addproduct-node-45">Total Count</td>
                                        <td colSpan="2" className={portalClass("centered-input-final")}>
                                            <input type="number" value={totalCount} onChange={e => setTotalCount(e.target.value)} className="tsup-addproduct-node-46" />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className={portalClass("image-upload-container-final")}>
                        <label className={portalClass("upload-btn-final")}>
                            Upload Image
                            <input type="file" accept="image/*" style={{
              display: 'none'
            }} onChange={handleImageUpload} className="tsup-addproduct-node-47" />
                        </label>
                        {uploadedImage && <img src={uploadedImage} alt="Uploaded" className={portalClass("preview-image-final")} />}
                    </div>
                </div>

                <div className={portalClass("section4-right-final")}></div>
            </div>

            <div className={portalClass("admin-section5")}>
                <button className={portalClass("add-product-final-btn")} onClick={handleAddProduct}>Add Product</button>
            </div>

            {popupMessage && <div className={portalClass(`popup-card ${popupType}`)}>
                    {popupMessage}
                </div>}
        </div>;
};
export default AddProduct;
