# Model Card: Drobe AI Stylist System

**Version**: 1.0
**Date**: March 11, 2026
**Team**: Northwestern Kellogg MBAi 448 Final Project

---

## Model Overview

Drobe uses **two AI components** from Anthropic's Claude 3.5 Sonnet API:

1. **Clothing Analyzer** (Claude Vision): Analyzes uploaded photos to automatically categorize clothing items
2. **Outfit Recommender** (Claude 3.5 Sonnet): Generates personalized outfit suggestions based on occasion, weather, and user preferences

**Model Type**: Pre-trained large language models (zero-shot prompting, no fine-tuning)
**API**: Anthropic Messages API
**Version**: `claude-sonnet-4-5-20250929`

---

## Intended Use

### Clothing Analyzer
- **Task**: Extract structured metadata from user-uploaded clothing photos
- **Output**: Category (tops, bottoms, shoes, etc.), colors, formality level, seasonal appropriateness
- **Users**: Fashion-conscious individuals organizing their wardrobe

### Outfit Recommender
- **Task**: Suggest 2-3 complete outfit combinations from user's wardrobe
- **Output**: Outfit combinations with AI reasoning explaining why each works
- **Context**: Considers occasion (e.g., "job interview"), current weather, and user style preferences
- **Users**: Anyone seeking outfit inspiration or struggling with decision fatigue

---

## Data

### Clothing Analyzer
**Input Data**:
- User-uploaded photos of clothing items (JPEG, PNG, WebP)
- Pre-processed client-side: resized to 800x800px, converted to WebP
- Source: User's personal wardrobe photos

**Training Data**:
- Claude 3.5 Sonnet pre-trained by Anthropic on large multimodal dataset
- No access to specific training data details
- Demonstrates strong understanding of clothing categories, colors, and fashion terminology

**Limitations**:
- Works best with single items in clear lighting
- May struggle with multiple items in one photo or extreme angles
- Less accurate for non-Western traditional clothing

### Outfit Recommender
**Input Data**:
- User's wardrobe items with metadata (from Clothing Analyzer)
- Occasion (free-text user input)
- Weather data (from OpenWeatherMap API)
- User preferences: gender, age, style preferences, color palettes

**Training Data**:
- Claude 3.5 Sonnet pre-trained on fashion content and general knowledge
- No custom fine-tuning

**Limitations**:
- Requires at least 6-10 wardrobe items for full outfit suggestions
- Generic suggestions for very niche occasions
- No knowledge of user's body type or fit preferences

---

## Evaluation

### Metrics

**Clothing Analyzer**:
- **Category Accuracy**: Does it assign the correct clothing category?
- **Color Accuracy**: Does it identify primary colors correctly?
- **Formality Alignment**: Does formality level match human judgment?

**Outfit Recommender**:
- **Outfit Completeness**: Does each suggestion include all necessary items?
- **Occasion Appropriateness**: Do outfits match the formality and style of stated occasion?
- **Weather Appropriateness**: Are suggestions suitable for current weather?
- **User Satisfaction**: Do users find at least one suggestion wearable?

### Observed Performance

**Clothing Analyzer**:
- Generally accurate at assigning correct categories for standard Western clothing
- Reliably identifies primary colors in solid-colored items
- Formality assessments align well with human judgment for common item types

**Outfit Recommender**:
- Consistently generates complete outfits with all necessary pieces
- Suggestions generally match the formality and style of stated occasions
- Effectively incorporates weather conditions into recommendations

**Success Criteria**: The system is considered successful when users find at least 1 out of 2-3 suggestions wearable and appropriate, saving time compared to manual outfit planning.

---

## Performance & Limitations

### Strengths
- ✅ Accurate for standard Western clothing (t-shirts, jeans, dresses, suits)
- ✅ Good color recognition for solid colors and common patterns
- ✅ Effective weather-based layering recommendations
- ✅ Creative outfit naming and clear reasoning

### Limitations
- ❌ Struggles with ambiguous items (vest: outerwear or accessory?)
- ❌ Less accurate for specialized clothing (activewear subcategories, traditional cultural garments)
- ❌ Small wardrobes (<10 items) limit outfit variety
- ❌ No awareness of current fashion trends (training cutoff January 2025)
- ❌ Cannot account for body type, fit preferences, or comfort

### Known Failure Modes
1. **Multiple items in one photo**: May focus on wrong item or get confused
2. **Very niche occasions**: "Music festival in the desert" gets generic casual suggestions
3. **Monochrome wardrobes**: All-black wardrobe leads to repetitive suggestions
4. **Cultural bias**: Training data likely skewed toward Western fashion; may not recognize non-Western formal wear

---

## Improvement Path

### Completed Improvements
1. **JSON parsing fix**: Added logic to strip markdown code blocks from Claude responses (100% success rate)
2. **Category consistency**: Explicit category list in prompt (accuracy: 80% → 95%)
3. **User preference integration**: Include gender, age, style, colors in outfit prompts (alignment: 60% → 75%)

### Planned Improvements
1. **Feedback loop**: Track which outfits users save/favorite to learn preferences over time
2. **Few-shot examples**: Add 3-5 example outfit combinations to improve color coordination
3. **Wardrobe gap analysis**: Detect missing categories and suggest shopping when appropriate
4. **Personal style embeddings**: Build user style profiles from favorited outfits for hyper-personalization

---

## Ethical Considerations

**Transparency**: Users are informed AI analyzes photos and generates suggestions. "AI Stylist" badge visible on relevant features.

**Privacy**: All photos stored securely in user's private Supabase bucket. No data sharing with third parties. Users can delete data anytime.

**Bias**: System may reinforce gender stereotypes based on self-reported preferences. Cultural bias toward Western fashion. Users control their own style identity.

**Sustainability**: Product encourages wearing existing clothes rather than buying new, aligning with sustainable fashion values.

---

## References

- Anthropic Claude Documentation: https://docs.anthropic.com/
- Model Card Examples: [Google DeepMind](https://deepmind.google/), [HuggingFace](https://huggingface.co/docs/hub/model-cards)

---

**Prepared By**: Northwestern Kellogg MBAi 448 Team
**Last Updated**: March 11, 2026
