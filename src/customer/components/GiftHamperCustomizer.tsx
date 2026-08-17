import React, { useState } from 'react';
import { Sparkles, Check, ChevronRight, ChevronLeft, ShoppingBag, Eye, Edit3, Heart, ArrowRight } from 'lucide-react';

export interface CustomizationState {
  tshirtSize: string;
  tshirtText: string;
  tshirtColor: string;
  mugText: string;
  bottleName: string;
  wishCardMessage: string;
  nameTagText: string;
  keychainText: string;
  magnetText: string;
  pillowText: string;
  pillowDesign: string;
  towelText: string;
  napkinText: string;
  capText: string;
  capDesign: string;
}

export const DEFAULT_CUSTOMIZATION: CustomizationState = {
  tshirtSize: 'L',
  tshirtText: '',
  tshirtColor: 'Jet Black',
  mugText: '',
  bottleName: '',
  wishCardMessage: '',
  nameTagText: '',
  keychainText: '',
  magnetText: '',
  pillowText: '',
  pillowDesign: 'Minimalist Crest',
  towelText: '',
  napkinText: '',
  capText: '',
  capDesign: 'Matte Black / Gold Thread',
};

interface GiftHamperCustomizerProps {
  initialValues?: Partial<CustomizationState>;
  onAddToCart: (customization: CustomizationState) => void;
  onBuyNow?: (customization: CustomizationState) => void;
  isEditingInCart?: boolean;
  onSaveCartEdit?: (customization: CustomizationState) => void;
}

export default function GiftHamperCustomizer({
  initialValues,
  onAddToCart,
  onBuyNow,
  isEditingInCart = false,
  onSaveCartEdit,
}: GiftHamperCustomizerProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [customization, setCustomization] = useState<CustomizationState>({
    ...DEFAULT_CUSTOMIZATION,
    ...initialValues,
  });

  const updateField = (field: keyof CustomizationState, value: string) => {
    setCustomization((prev) => ({ ...prev, [field]: value }));
  };

  const TOTAL_STEPS = 11;

  const stepsList = [
    { number: 1, title: 'Choose T-Shirt Size' },
    { number: 2, title: 'T-Shirt Custom Text' },
    { number: 3, title: 'Mug Custom Text' },
    { number: 4, title: 'Water Bottle Name' },
    { number: 5, title: 'Wish Card Message' },
    { number: 6, title: 'Name Tag Text' },
    { number: 7, title: 'Keychain Text' },
    { number: 8, title: 'Fridge Magnet Text' },
    { number: 9, title: 'Optional Designs' },
    { number: 10, title: 'Review Your Hamper' },
    { number: 11, title: 'Add to Cart' },
  ];

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="bg-[#FFFFFF] border border-[#E8E5DD] rounded-xl p-5 sm:p-7 shadow-xs space-y-6">
      {/* Wizard Header & Progress Bar */}
      <div className="border-b border-[#E8E5DD] pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-[#0B0B0B] text-[#C9A227] rounded text-xs font-bold">
              <Sparkles size={14} />
            </span>
            <div>
              <span className="text-[10px] font-bold text-[#C9A227] uppercase tracking-widest">
                STEP {currentStep} OF {TOTAL_STEPS}
              </span>
              <h3 className="text-sm sm:text-base font-serif font-bold text-[#0B0B0B] uppercase">
                {stepsList[currentStep - 1].title}
              </h3>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-semibold text-[#666666] tracking-wider uppercase">
              {Math.round((currentStep / TOTAL_STEPS) * 100)}% Complete
            </span>
          </div>
        </div>

        {/* Progress Bar Track */}
        <div className="w-full bg-[#F3F1EB] h-1.5 mt-3 overflow-hidden rounded-full">
          <div
            className="h-full bg-[#C9A227] transition-all duration-300"
            style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
          />
        </div>

        {/* Step Quick Pills */}
        <div className="flex gap-1 overflow-x-auto pt-3 pb-1 no-scrollbar text-[10px]">
          {stepsList.map((st) => (
            <button
              key={st.number}
              type="button"
              onClick={() => setCurrentStep(st.number)}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap font-medium transition-colors cursor-pointer ${
                currentStep === st.number
                  ? 'bg-[#0B0B0B] text-[#C9A227] font-bold'
                  : currentStep > st.number
                  ? 'bg-[#F3F1EB] text-[#0B0B0B] font-semibold border border-[#C9A227]/40'
                  : 'bg-[#F8F7F2] text-gray-400'
              }`}
            >
              {st.number}. {st.title}
            </button>
          ))}
        </div>
      </div>

      {/* STEP CONTENT BODY */}
      <div className="min-h-[180px] flex flex-col justify-center">
        {/* STEP 1: Choose T-Shirt Size */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <p className="text-xs text-[#666666] font-medium">
              Select the size and base color for your customized printed 100% organic cotton T-Shirt included in the hamper box.
            </p>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0B0B0B]">Select Size *</label>
              <div className="flex flex-wrap gap-2.5">
                {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => updateField('tshirtSize', sz)}
                    className={`w-12 h-11 border text-xs font-bold rounded flex items-center justify-center transition-all cursor-pointer ${
                      customization.tshirtSize === sz
                        ? 'border-[#0B0B0B] bg-[#0B0B0B] text-white ring-2 ring-[#C9A227]'
                        : 'border-[#E8E5DD] bg-white text-[#0B0B0B] hover:border-[#C9A227]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0B0B0B]">Select Color</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {['Jet Black', 'Ivory White', 'Navy Blue', 'Heather Grey'].map((clr) => (
                  <button
                    key={clr}
                    type="button"
                    onClick={() => updateField('tshirtColor', clr)}
                    className={`py-2 px-3 border text-xs font-semibold rounded text-left transition-all cursor-pointer flex items-center gap-2 ${
                      customization.tshirtColor === clr
                        ? 'border-[#C9A227] bg-[#F8F7F2] text-[#0B0B0B] font-bold'
                        : 'border-[#E8E5DD] bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-gray-400 shrink-0"
                      style={{
                        backgroundColor:
                          clr === 'Jet Black'
                            ? '#0B0B0B'
                            : clr === 'Ivory White'
                            ? '#F8F7F2'
                            : clr === 'Navy Blue'
                            ? '#1B2A4A'
                            : '#8E8E8E',
                      }}
                    />
                    {clr}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Enter T-Shirt Custom Text */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <p className="text-xs text-[#666666] font-medium">
              Enter custom text, initials, or name to be printed on your T-Shirt. Leave empty if you prefer unprinted branding.
            </p>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0B0B0B]">Custom T-Shirt Text</label>
              <input
                type="text"
                value={customization.tshirtText}
                onChange={(e) => updateField('tshirtText', e.target.value)}
                placeholder="e.g. ADITYA / BLACKFAWN ATELIER"
                className="w-full bg-[#F8F7F2] border border-[#E8E5DD] rounded px-4 py-2.5 text-xs text-[#0B0B0B] outline-none focus:border-[#C9A227] font-medium"
              />
            </div>
          </div>
        )}

        {/* STEP 3: Enter Mug Custom Text */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <p className="text-xs text-[#666666] font-medium">
              Enter custom name or greeting text to be printed on the high-gloss ceramic coffee mug.
            </p>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0B0B0B]">Custom Mug Text</label>
              <input
                type="text"
                value={customization.mugText}
                onChange={(e) => updateField('mugText', e.target.value)}
                placeholder="e.g. Best Wishes / Aditya's Brew"
                className="w-full bg-[#F8F7F2] border border-[#E8E5DD] rounded px-4 py-2.5 text-xs text-[#0B0B0B] outline-none focus:border-[#C9A227] font-medium"
              />
            </div>
          </div>
        )}

        {/* STEP 4: Enter Water Bottle Name */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <p className="text-xs text-[#666666] font-medium">
              Specify the exact name to laser-engrave on the double-walled matte black insulated metal water bottle.
            </p>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0B0B0B]">Engraved Bottle Name</label>
              <input
                type="text"
                value={customization.bottleName}
                onChange={(e) => updateField('bottleName', e.target.value)}
                placeholder="e.g. ADITYA PHOPHALE"
                className="w-full bg-[#F8F7F2] border border-[#E8E5DD] rounded px-4 py-2.5 text-xs text-[#0B0B0B] outline-none focus:border-[#C9A227] font-medium"
              />
            </div>
          </div>
        )}

        {/* STEP 5: Enter Wish Card Message */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <p className="text-xs text-[#666666] font-medium">
              Write a personalized greeting message to be gold-foil embossed on the luxury wish card enclosed inside the box.
            </p>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0B0B0B]">Wish Card Message</label>
              <textarea
                rows={3}
                value={customization.wishCardMessage}
                onChange={(e) => updateField('wishCardMessage', e.target.value)}
                placeholder="Wishing you unforgettable moments and timeless joy..."
                className="w-full bg-[#F8F7F2] border border-[#E8E5DD] rounded p-3 text-xs text-[#0B0B0B] outline-none focus:border-[#C9A227] font-medium"
              />
            </div>
          </div>
        )}

        {/* STEP 6: Enter Name Tag Text */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <p className="text-xs text-[#666666] font-medium">
              Enter title or name to etch onto the solid metallic name tag badge.
            </p>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0B0B0B]">Name Tag Text</label>
              <input
                type="text"
                value={customization.nameTagText}
                onChange={(e) => updateField('nameTagText', e.target.value)}
                placeholder="e.g. ADITYA / CREATIVE DIRECTOR"
                className="w-full bg-[#F8F7F2] border border-[#E8E5DD] rounded px-4 py-2.5 text-xs text-[#0B0B0B] outline-none focus:border-[#C9A227] font-medium"
              />
            </div>
          </div>
        )}

        {/* STEP 7: Enter Keychain Text */}
        {currentStep === 7 && (
          <div className="space-y-4">
            <p className="text-xs text-[#666666] font-medium">
              Enter initials or short text for the brushed gold & leather customized keychain.
            </p>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0B0B0B]">Keychain Text / Initial</label>
              <input
                type="text"
                value={customization.keychainText}
                onChange={(e) => updateField('keychainText', e.target.value)}
                placeholder="e.g. A.P. / BLACKFAWN"
                className="w-full bg-[#F8F7F2] border border-[#E8E5DD] rounded px-4 py-2.5 text-xs text-[#0B0B0B] outline-none focus:border-[#C9A227] font-medium"
              />
            </div>
          </div>
        )}

        {/* STEP 8: Enter Fridge Magnet Text */}
        {currentStep === 8 && (
          <div className="space-y-4">
            <p className="text-xs text-[#666666] font-medium">
              Enter text or quote for the acrylic high-gloss fridge magnet.
            </p>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0B0B0B]">Fridge Magnet Text</label>
              <input
                type="text"
                value={customization.magnetText}
                onChange={(e) => updateField('magnetText', e.target.value)}
                placeholder="e.g. Dream Big / Aditya"
                className="w-full bg-[#F8F7F2] border border-[#E8E5DD] rounded px-4 py-2.5 text-xs text-[#0B0B0B] outline-none focus:border-[#C9A227] font-medium"
              />
            </div>
          </div>
        )}

        {/* STEP 9: Choose Optional Design / Customization */}
        {currentStep === 9 && (
          <div className="space-y-4">
            <p className="text-xs text-[#666666] font-medium">
              Customize optional details for your Pillow, Towel, Hand Napkin, and Structured Cap.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="block font-bold text-[#0B0B0B]">Pillow Custom Text</label>
                <input
                  type="text"
                  value={customization.pillowText}
                  onChange={(e) => updateField('pillowText', e.target.value)}
                  placeholder="e.g. Aditya's Lounge"
                  className="w-full bg-[#F8F7F2] border border-[#E8E5DD] rounded px-3 py-2 outline-none focus:border-[#C9A227]"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-[#0B0B0B]">Towel Monogram</label>
                <input
                  type="text"
                  value={customization.towelText}
                  onChange={(e) => updateField('towelText', e.target.value)}
                  placeholder="e.g. A.P."
                  className="w-full bg-[#F8F7F2] border border-[#E8E5DD] rounded px-3 py-2 outline-none focus:border-[#C9A227]"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-[#0B0B0B]">Hand Napkin Text</label>
                <input
                  type="text"
                  value={customization.napkinText}
                  onChange={(e) => updateField('napkinText', e.target.value)}
                  placeholder="e.g. Aditya"
                  className="w-full bg-[#F8F7F2] border border-[#E8E5DD] rounded px-3 py-2 outline-none focus:border-[#C9A227]"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-[#0B0B0B]">Cap Embroidery Text</label>
                <input
                  type="text"
                  value={customization.capText}
                  onChange={(e) => updateField('capText', e.target.value)}
                  placeholder="e.g. BLACKFAWN"
                  className="w-full bg-[#F8F7F2] border border-[#E8E5DD] rounded px-3 py-2 outline-none focus:border-[#C9A227]"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 10: Review Your Hamper */}
        {currentStep === 10 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E5DD] pb-2">
              <span className="text-xs font-bold text-[#0B0B0B] uppercase tracking-wider flex items-center gap-1.5">
                <Eye size={14} className="text-[#C9A227]" /> Hamper Customization Summary
              </span>
              <span className="text-[10px] text-[#C9A227] font-bold uppercase">14 Items Included</span>
            </div>

            <div className="bg-[#F8F7F2] border border-[#E8E5DD] rounded-lg p-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-white p-2.5 rounded border border-[#E8E5DD]">
                  <span className="text-[9px] text-[#666666] uppercase font-bold">T-Shirt Specs</span>
                  <p className="font-bold text-[#0B0B0B] mt-0.5">Size: {customization.tshirtSize} ({customization.tshirtColor})</p>
                  <p className="text-[10.5px] text-gray-600 truncate">{customization.tshirtText || 'Default Logo'}</p>
                </div>

                <div className="bg-white p-2.5 rounded border border-[#E8E5DD]">
                  <span className="text-[9px] text-[#666666] uppercase font-bold">Mug Text</span>
                  <p className="font-bold text-[#0B0B0B] mt-0.5 truncate">{customization.mugText || 'Standard Atelier'}</p>
                </div>

                <div className="bg-white p-2.5 rounded border border-[#E8E5DD]">
                  <span className="text-[9px] text-[#666666] uppercase font-bold">Metal Bottle</span>
                  <p className="font-bold text-[#0B0B0B] mt-0.5 truncate">{customization.bottleName || 'Standard Atelier'}</p>
                </div>

                <div className="bg-white p-2.5 rounded border border-[#E8E5DD]">
                  <span className="text-[9px] text-[#666666] uppercase font-bold">Wish Card</span>
                  <p className="font-bold text-[#0B0B0B] mt-0.5 line-clamp-2">{customization.wishCardMessage || 'Complimentary Card'}</p>
                </div>

                <div className="bg-white p-2.5 rounded border border-[#E8E5DD]">
                  <span className="text-[9px] text-[#666666] uppercase font-bold">Name Badge</span>
                  <p className="font-bold text-[#0B0B0B] mt-0.5 truncate">{customization.nameTagText || 'Standard Etch'}</p>
                </div>

                <div className="bg-white p-2.5 rounded border border-[#E8E5DD]">
                  <span className="text-[9px] text-[#666666] uppercase font-bold">Keychain & Magnet</span>
                  <p className="font-bold text-[#0B0B0B] mt-0.5 truncate">KC: {customization.keychainText || 'A'}</p>
                  <p className="text-[10px] text-gray-500 truncate">Mag: {customization.magnetText || 'Standard'}</p>
                </div>
              </div>

              <div className="text-[10px] text-gray-500 border-t border-[#E8E5DD] pt-2 flex items-center gap-2">
                <Check size={12} className="text-[#C9A227]" />
                <span>Includes Handmade Chocolates, Aroma Candle & Gourmet Cookies (No customization needed).</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 11: Add to Cart */}
        {currentStep === 11 && (
          <div className="space-y-5 text-center py-2">
            <div className="inline-flex p-3 bg-[#0B0B0B] text-[#C9A227] rounded-full shadow-md">
              <Check size={24} />
            </div>

            <div>
              <h4 className="text-base font-serif font-bold text-[#0B0B0B] uppercase">Your Custom Hamper Is Ready!</h4>
              <p className="text-xs text-[#666666] max-w-sm mx-auto mt-1 font-medium">
                Your 14 bespoke hamper selections are saved and ready to be added to your shopping bag.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto pt-2">
              {isEditingInCart ? (
                <button
                  type="button"
                  onClick={() => onSaveCartEdit && onSaveCartEdit(customization)}
                  className="w-full py-3.5 bg-[#0B0B0B] text-white hover:text-[#C9A227] border border-[#0B0B0B] text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  <Check size={14} /> Save Customization Changes
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => onAddToCart(customization)}
                    className="flex-1 py-3.5 bg-[#FFFFFF] border border-[#0B0B0B] text-[#0B0B0B] hover:border-[#C9A227] hover:text-[#C9A227] text-xs font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <ShoppingBag size={14} className="text-[#C9A227]" /> Add to Bag
                  </button>

                  {onBuyNow && (
                    <button
                      type="button"
                      onClick={() => onBuyNow(customization)}
                      className="flex-1 py-3.5 bg-[#0B0B0B] text-white hover:text-[#C9A227] border border-[#0B0B0B] hover:border-[#C9A227] text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                    >
                      Express Buy <ArrowRight size={14} className="text-[#C9A227]" />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER WIZARD CONTROLS */}
      <div className="flex justify-between items-center border-t border-[#E8E5DD] pt-4">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentStep === 1}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded border transition-colors flex items-center gap-1 cursor-pointer ${
            currentStep === 1
              ? 'opacity-40 cursor-not-allowed border-gray-200 text-gray-400'
              : 'border-[#E8E5DD] bg-white text-[#0B0B0B] hover:bg-[#F8F7F2]'
          }`}
        >
          <ChevronLeft size={14} /> Back
        </button>

        {currentStep < TOTAL_STEPS && (
          <button
            type="button"
            onClick={handleNext}
            className="px-5 py-2 bg-[#0B0B0B] text-white hover:text-[#C9A227] text-xs font-bold uppercase tracking-widest rounded border border-[#0B0B0B] transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            Next Step <ChevronRight size={14} className="text-[#C9A227]" />
          </button>
        )}
      </div>
    </div>
  );
}
