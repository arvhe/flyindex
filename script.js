/* ================= CONFIG ================= */

const ALL_MATERIALS = [
  "Fly hooks","Lead wire","Lead-free wire","Tungsten wire","Dumbbell eyes",
  "Cone heads","Bead heads","Thread","Monofilament","Floss","Wire thread","Wax",
  "Marabou","Coq de Leon fibers","Pheasant tail fibers","Bucktail","Hackle fibers",
  "Microfibbets","Rubber legs","Synthetic tail fibers","Dubbing","Chenille",
  "Antron yarn","Ice dubbing","SLF dubbing","Fritz","Tinsel","Foam","Yarn",
  "Peacock herl","Wire","Mylar","Stretch tubing","CDC feathers","Elk hair",
  "Deer hair","Mallard flank","Turkey tail","Goose biots","Synthetic wing fibers",
  "EP fibers","Rooster hackle","Hen hackle","Partridge feathers","Schlappen",
  "Soft hackle feathers","Head cement","UV resin","Epoxy","Stick-on eyes",
  "Mono eyes","Foam heads","Flashabou","Krystal Flash","Holographic tinsel",
  "Silicone legs","Craft fur","Angel hair","Polar fiber","Rabbit fur",
  "Squirrel fur","Muskrat fur","Seal substitute","Ostrich herl","Grouse feathers"
];

const ALL_TAGS = [
  "Saltwater", "Freshwater", "Nymph", "Dry Fly", "Wet Fly", "Streamer",
  "Terrestrial", "Emerger", "Bass", "Trout", "Salmon", "Carp", "Panfish",
  "Pike", "Warmwater", "Coldwater", "Stillwater", "River", "Lake", "Attractor",
  "Imitator", "Beginner", "Advanced"
];

/* ================= STATE ================= */

let flies = [];
let selectedMaterials = JSON.parse(localStorage.getItem("materials")) || [];
selectedMaterials = selectedMaterials.filter(m => m && m.trim() !== "");
let selectedTags = JSON.parse(localStorage.getItem("tags")) || [];
selectedTags = selectedTags.filter(t => t && t.trim() !== "");

/* ================= ELEMENTS ================= */

const flyGrid = document.getElementById("flyGrid");
const searchInput = document.getElementById("searchInput");
const searchBar = document.getElementById("searchBar");

const toggleSearch = document.getElementById("toggleSearch");
const openMaterials = document.getElementById("openMaterials");

const materialsModal = document.getElementById("materialsModal");
const materialsList = document.getElementById("materialsList");
const saveMaterials = document.getElementById("saveMaterials");

const tagButtonsContainer = document.getElementById("tagButtons");
const clearTagsBtn = document.getElementById("clearTags");
const tagFilterSection = document.getElementById("tagFilterSection");
const tagFilterHeader = document.getElementById("tagFilterHeader");
const tagFilterContent = document.getElementById("tagFilterContent");
const toggleArrow = document.getElementById("toggleArrow");

const flyModal = document.getElementById("flyModal");
const closeFlyModal = document.getElementById("closeFlyModal");

/* ================= HELPERS ================= */

function normalizeItem(raw) {
  if (!raw) return "";
  return raw.toString().trim();
}

function slugify(name) {
  return normalizeItem(name).toLowerCase().replace(/\s+/g, '-');
}

/* ================= LOAD DATA ================= */

fetch('flies.json')
  .then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  })
  .then(data => {
    if (!Array.isArray(data)) {
      console.error("flies.json is not an array");
      flyGrid.innerHTML = "<p style='text-align:center'>Invalid fly data</p>";
      return;
    }

    flies = data.map(fly => {
      const flySlug = slugify(fly.name);

      // Backward compatibility: single variant
      if (!fly.variants || !Array.isArray(fly.variants) || fly.variants.length === 0) {
        return {
          name: normalizeItem(fly.name) || "Unnamed Fly",
          slug: flySlug,
          currentVariant: 0,
          variants: [{
            variantName: "Standard",
            image: fly.image ? `images/${flySlug}/${fly.image}` : "https://via.placeholder.com/400x300?text=No+Image",
            materials: (fly.materials || []).map(normalizeItem).filter(Boolean),
            tags: (fly.tags || []).map(normalizeItem).filter(Boolean),
            instructions: (fly.instructions || "").toString().trim()
          }]
        };
      }

      return {
        name: normalizeItem(fly.name) || "Unnamed Fly",
        slug: flySlug,
        currentVariant: 0,
        variants: fly.variants.map(v => ({
          variantName: normalizeItem(v.variantName) || "Standard",
          image: v.image ? `images/${flySlug}/${v.image}` : "https://via.placeholder.com/400x300?text=No+Image",
          materials: (v.materials || []).map(normalizeItem).filter(Boolean),
          tags: (v.tags || []).map(normalizeItem).filter(Boolean),
          instructions: (v.instructions || "").toString().trim()
        }))
      };
    });

    buildMaterialsList();
    buildTagButtons();
    applyFilters();
  })
  .catch(err => {
    console.error("Error loading flies.json:", err);
    flyGrid.innerHTML = "<p style='text-align:center'>Failed to load flies.json</p>";
  });

/* ================= SEARCH ================= */

toggleSearch.onclick = () => {
  searchBar.classList.toggle("hidden");
  if (!searchBar.classList.contains("hidden")) {
    searchInput.focus();
  }
};

tagFilterHeader.onclick = () => {
  tagFilterContent.style.display = tagFilterContent.style.display === 'block' ? 'none' : 'block';
  toggleArrow.classList.toggle('fa-chevron-down');
  toggleArrow.classList.toggle('fa-chevron-up');
};

searchInput.addEventListener("input", () => {
  applyFilters();
});

/* ================= MATERIAL FILTER ================= */

openMaterials.onclick = () => {
  materialsModal.style.display = "flex";
};

saveMaterials.onclick = () => {
  selectedMaterials = [...materialsList.querySelectorAll("input:checked")].map(i => i.value);
  localStorage.setItem("materials", JSON.stringify(selectedMaterials));
  materialsModal.style.display = "none";
  applyFilters();
};

function buildMaterialsList() {
  materialsList.innerHTML = "";
  ALL_MATERIALS.forEach(mat => {
    const label = document.createElement("label");
    label.innerHTML = `
      <input type="checkbox" value="${mat}" ${selectedMaterials.includes(mat) ? "checked" : ""}>
      ${mat}
    `;
    materialsList.appendChild(label);
  });
}

/* ================= TAG FILTER ================= */

function buildTagButtons() {
  tagButtonsContainer.innerHTML = "";
  ALL_TAGS.forEach(tag => {
    const btn = document.createElement("button");
    btn.className = "tag-btn";
    btn.textContent = tag;
    btn.dataset.tag = tag;
    if (selectedTags.includes(tag)) btn.classList.add("active");
    btn.onclick = () => {
      if (selectedTags.includes(tag)) {
        selectedTags = selectedTags.filter(t => t !== tag);
        btn.classList.remove("active");
      } else {
        selectedTags.push(tag);
        btn.classList.add("active");
      }
      localStorage.setItem("tags", JSON.stringify(selectedTags));
      applyFilters();
    };
    tagButtonsContainer.appendChild(btn);
  });
}

clearTagsBtn.onclick = () => {
  selectedTags = [];
  localStorage.setItem("tags", JSON.stringify(selectedTags));
  document.querySelectorAll(".tag-btn.active").forEach(b => b.classList.remove("active"));
  applyFilters();
};

/* ================= FILTERS ================= */

function applyFilters() {
  const query = searchInput.value.toLowerCase().trim();
  const cleanMaterials = selectedMaterials.filter(m => m.trim() !== "");
  const cleanTags = selectedTags.filter(t => t.trim() !== "");

  let filtered = flies;

  if (query) {
    filtered = filtered.filter(fly =>
      fly.name.toLowerCase().includes(query) ||
      fly.variants.some(v =>
        v.variantName.toLowerCase().includes(query) ||
        v.tags.some(tag => tag.toLowerCase().includes(query))
      )
    );
  }

  if (cleanMaterials.length > 0) {
    filtered = filtered.filter(fly =>
      fly.variants.some(v =>
        cleanMaterials.every(mat =>
          v.materials.some(m => m.toLowerCase() === mat.toLowerCase())
        )
      )
    );
  }

  if (cleanTags.length > 0) {
    filtered = filtered.filter(fly =>
      fly.variants.some(v =>
        cleanTags.every(tag =>
          v.tags.some(t => t.toLowerCase() === tag.toLowerCase())
        )
      )
    );
  }

  renderFlies(filtered);
}

/* ================= RENDER ================= */

function renderFlies(data) {
  flyGrid.innerHTML = "";
  if (!data.length) {
    flyGrid.innerHTML = "<p style='text-align:center'>No matching flies</p>";
    return;
  }
  data.forEach(fly => {
    const card = document.createElement("div");
    card.className = "card";
    const firstImage = fly.variants[0].image;
    card.innerHTML = `
      <img src="${firstImage}" alt="${fly.name}" onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
      <h3>${fly.name}</h3>
    `;
    card.onclick = () => openFlyModal(fly);
    flyGrid.appendChild(card);
  });
}

/* ================= MODAL ================= */

function openFlyModal(fly) {
  window.scrollTo(0, 0);
  flyModal.style.display = "flex";

  document.getElementById("modalName").textContent = fly.name;

  const dropdown = document.getElementById("variantDropdown");
  dropdown.innerHTML = "";
  fly.variants.forEach((variant, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = variant.variantName;
    dropdown.appendChild(option);
  });
  dropdown.value = fly.currentVariant;

  const updateVariant = (index) => {
    const v = fly.variants[index];
    document.getElementById("modalImage").src = v.image;
    document.getElementById("modalName").textContent = `${fly.name} - ${v.variantName}`;

    const materialsUl = document.getElementById("modalMaterials");
    materialsUl.innerHTML = v.materials.length === 0 ? "<li>None listed</li>" : "";
    v.materials.forEach(m => {
      const li = document.createElement("li");
      li.textContent = m;
      materialsUl.appendChild(li);
    });

    const tagsUl = document.getElementById("modalTags");
    tagsUl.innerHTML = v.tags.length === 0 ? "<li>None assigned</li>" : "";
    v.tags.forEach(t => {
      const li = document.createElement("li");
      li.textContent = t;
      tagsUl.appendChild(li);
    });

    const instructionsDiv = document.getElementById("modalInstructions");
    instructionsDiv.textContent = v.instructions.trim() || "No tying instructions provided for this pattern yet.";

    fly.currentVariant = index;
  };

  updateVariant(fly.currentVariant);

  dropdown.onchange = (e) => updateVariant(parseInt(e.target.value));
}

closeFlyModal.onclick = () => {
  flyModal.style.display = "none";
};

window.onclick = e => {
  if (e.target === flyModal || e.target === materialsModal) {
    flyModal.style.display = "none";
    materialsModal.style.display = "none";
  }
};