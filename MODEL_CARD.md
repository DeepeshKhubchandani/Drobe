# Model Card: Drobe AI Stylist System

**Version**: 1.0
**Date**: March 11, 2026
**Organization**: Drobe
**Contact**: Northwestern Kellogg MBAi 448 Final Project

---

## Model Overview

### What does this model do?

The Drobe AI Stylist System consists of **two AI components** working together to automate wardrobe management and provide personalized outfit recommendations:

1. **Clothing Analyzer** (Claude Vision): Automatically categorizes and tags uploaded clothing photos
2. **Outfit Recommender** (Claude 3.5 Sonnet): Generates personalized outfit combinations based on user preferences, occasion, and weather

### What type of models are they?

**Component 1: Clothing Analyzer**
- **Model**: Claude 3.5 Sonnet with Vision (multimodal large language model)
- **Provider**: Anthropic
- **Type**: Vision-language model fine-tuned for image understanding
- **API**: Anthropic Messages API with image inputs
- **Version**: `claude-sonnet-4-5-20250929`

**Component 2: Outfit Recommender**
- **Model**: Claude 3.5 Sonnet (text-only large language model)
- **Provider**: Anthropic
- **Type**: Large language model with reasoning and recommendation capabilities
- **API**: Anthropic Messages API
- **Version**: `claude-sonnet-4-5-20250929`

### Architecture

The system uses a **zero-shot prompting approach** with structured outputs:
- No fine-tuning or custom training
- Relies on Claude's pre-trained knowledge of fashion, clothing, and styling
- Uses careful prompt engineering to ensure consistent, structured JSON responses
- Edge Functions (serverless) handle API calls to keep keys secure

---

## Intended Use

### What is the model's role in your product?

**Clothing Analyzer**:
- **Primary Task**: Extract metadata from clothing photos uploaded by users
- **Output**: Structured categorization (category, subcategory, colors, formality, seasons, patterns)
- **Trigger**: Runs automatically after each photo upload
- **User Value**: Eliminates manual tagging, enables smart filtering and search

**Outfit Recommender**:
- **Primary Task**: Suggest complete outfit combinations from user's wardrobe
- **Output**: 2-3 outfit suggestions with item combinations and styling reasoning
- **Trigger**: User-initiated via "Style AI" screen with occasion input
- **User Value**: Saves decision fatigue, discovers new combinations, weather-aware styling

### For whom?

**Target Users**:
- Fashion-conscious individuals who want to maximize their existing wardrobe
- People who struggle with outfit planning or decision fatigue
- Users interested in sustainable fashion (wearing what they own)
- Busy professionals who want quick, weather-appropriate outfit suggestions

**Use Cases**:
1. Morning routine: "What should I wear to work today?"
2. Event planning: "Help me dress for a wedding this weekend"
3. Weather adaptation: "It's raining and 50°F, what should I wear?"
4. Wardrobe organization: Automatically tag 100+ clothing items without manual input

---

## Data

### Clothing Analyzer Data

**Input Data at Inference**:
- **Type**: User-uploaded photos of clothing items
- **Format**: JPEG, PNG, or WebP images
- **Pre-processing**: Client-side resize to 800x800px, WebP conversion at 82% quality
- **Source**: User's personal wardrobe (photos taken via smartphone camera or uploaded from gallery)
- **Characteristics**:
  - Varied lighting conditions (indoor, outdoor, flash)
  - Different backgrounds (closet, bed, floor, hangers)
  - Various photo angles (flat lay, hanging, worn)
  - Consumer-quality smartphone photos (not professional product shots)

**Training Data**:
- Claude 3.5 Sonnet was pre-trained by Anthropic on a large corpus of text and images
- We do not have access to the specific training data
- Model demonstrates strong knowledge of:
  - Clothing categories and fashion terminology
  - Color recognition and naming
  - Fabric types and patterns
  - Seasonal appropriateness
  - Formality levels (casual to formal)

**Known Limitations**:
- **Occluded items**: Partially visible clothing may be misclassified
- **Bundled items**: Multiple items in one photo (e.g., shirt + pants on hanger) may confuse the model
- **Accessories**: Small accessories (jewelry, belts) harder to categorize than larger garments
- **Non-Western fashion**: May have less accurate categorization for non-Western traditional clothing
- **Extreme lighting**: Very dark or overexposed photos reduce accuracy

### Outfit Recommender Data

**Input Data at Inference**:
- **User wardrobe**: Array of clothing items with metadata (category, subcategory, colors, formality)
- **User preferences**: Gender, age, style preferences (minimalist, streetwear, etc.), color palettes
- **Occasion**: Free-text user input (e.g., "job interview", "casual brunch", "date night")
- **Weather data**: Current temperature (°F), conditions (sunny, rainy), wind speed
- **Source**: Combination of user-generated data (wardrobe photos, preferences) and external API (OpenWeatherMap)

**Training Data**:
- Claude 3.5 Sonnet pre-trained on fashion blogs, styling guides, and general knowledge
- No custom fine-tuning performed for this application
- Leverages general fashion knowledge and common-sense reasoning

**Known Limitations**:
- **Small wardrobes**: Needs at least 6-10 items to create full outfits; fewer items = limited combinations
- **Monochrome wardrobes**: All-black or all-neutral wardrobes may receive repetitive suggestions
- **Niche occasions**: Very specific events (e.g., "Renaissance fair") may get generic suggestions
- **Personal taste**: AI doesn't know user's body type, comfort preferences, or cultural context beyond stated preferences
- **Weather accuracy**: Relies on OpenWeatherMap accuracy and user's location settings

---

## Evaluation

### Clothing Analyzer

**Metrics**:
1. **Category Accuracy**: Does the model assign the correct primary category (tops, bottoms, etc.)?
2. **Color Accuracy**: Does the model identify the primary colors correctly?
3. **Formality Alignment**: Does the formality level (casual, smart casual, formal) match human judgment?
4. **Season Appropriateness**: Are seasonal tags (spring, summer, fall, winter) reasonable?

**Why these metrics?**
- **Category accuracy** is critical for filtering and search functionality
- **Color accuracy** enables color-based outfit coordination
- **Formality** ensures outfit suggestions match occasion appropriateness
- **Seasons** filter out weather-inappropriate items

**Evaluation Approach** (Manual Testing):
- Uploaded 50 diverse clothing items during development
- Manually reviewed AI-generated tags against ground truth
- Iteratively refined prompts to improve output consistency

**Results** (Informal Testing):
- **Category Accuracy**: ~95% (48/50 items correctly categorized)
  - Errors: 1 vest misclassified as "tops" instead of "outerwear", 1 scarf as "accessories" (debatable)
- **Color Accuracy**: ~90% (45/50 primary colors correct)
  - Errors: Mostly edge cases like "navy" vs "dark blue", "cream" vs "beige"
- **Formality**: ~88% (44/50 subjectively reasonable)
  - Most disagreements were "casual" vs "smart casual" boundary
- **Seasons**: ~92% (46/50 reasonable)
  - Errors: Lightweight sweater marked "all-season" instead of "fall/winter/spring"

**What does "good" mean?**
- **Good category accuracy**: >90% for primary filtering to work reliably
- **Good color accuracy**: Close enough for outfit coordination (exact shade less important than color family)
- **Good formality**: Debatable cases are acceptable; user can manually correct
- **Overall**: AI should save time vs manual tagging, even if 10-15% of items need minor corrections

### Outfit Recommender

**Metrics**:
1. **Outfit Completeness**: Does each suggestion include all necessary clothing categories?
2. **Occasion Appropriateness**: Do outfits match the formality and style of the stated occasion?
3. **Weather Appropriateness**: Do suggestions consider temperature and weather conditions?
4. **Color Coordination**: Are color combinations harmonious?
5. **User Preference Alignment**: Do suggestions reflect user's stated style preferences?

**Why these metrics?**
- **Completeness** ensures users get actionable suggestions (not missing shoes, etc.)
- **Occasion appropriateness** is core value prop (can't wear gym clothes to wedding)
- **Weather consideration** differentiates AI from random suggestion
- **Color coordination** reflects basic styling competence
- **Preference alignment** enables personalization

**Evaluation Approach** (Manual Testing):
- Tested 20 different occasions with various wardrobe compositions
- Evaluated suggestions against common fashion norms
- User feedback from beta testers (friends/family)

**Results** (Informal Testing):
- **Completeness**: ~95% (19/20 requests included top, bottom, shoes)
  - 1 suggestion missing shoes (user had no shoes in wardrobe)
- **Occasion Appropriateness**: ~85% (17/20 matched formality level)
  - 2 "casual brunch" suggestions felt too formal (blazer when t-shirt would suffice)
  - 1 "job interview" suggestion was slightly too casual (chinos instead of dress pants)
- **Weather Appropriateness**: ~90% (18/20 considered weather)
  - 2 suggestions ignored weather in reasoning (though items were still reasonable)
- **Color Coordination**: ~80% (16/20 had harmonious colors)
  - 4 suggestions had questionable combos (e.g., bright green shirt + red pants)
- **Preference Alignment**: ~75% (15/20 reflected stated style preferences)
  - "Minimalist" preference not always respected (suggested patterned items)

**What does "good" mean?**
- **Good suggestions**: User finds at least 1 out of 2-3 suggestions wearable for the occasion
- **Great suggestions**: User discovers new combinations they wouldn't have thought of
- **Acceptable failures**: Occasional misses are okay if the system learns (through favorites tracking)
- **Overall**: AI should provide inspiration and save time, not replace human judgment

---

## Performance & Limitations

### Where does the model perform well?

**Clothing Analyzer Strengths**:
- ✅ Standard clothing categories (t-shirts, jeans, sneakers, dresses)
- ✅ Solid colors and common patterns (stripes, plaid)
- ✅ Clear, well-lit photos with single items
- ✅ Common Western fashion items (business casual, streetwear, athletic)
- ✅ Seasonal appropriateness for obvious items (winter coat, summer tank top)

**Outfit Recommender Strengths**:
- ✅ Common occasions (work, casual, date night, weddings)
- ✅ Weather-based layering recommendations
- ✅ Color theory (complementary colors, neutral palettes)
- ✅ Formality matching (casual → casual, formal → formal)
- ✅ Creative outfit naming and clear reasoning

### Where does the model struggle?

**Clothing Analyzer Limitations**:
- ❌ **Ambiguous items**: Vest (outerwear or accessory?), romper (top or bottom?)
- ❌ **Multiple items in one photo**: Shirt on hanger with pants in background
- ❌ **Low-quality photos**: Blurry, dark, or extreme angles
- ❌ **Specialized categories**: Activewear subcategories (yoga pants vs leggings), formal wear (tuxedo vs suit)
- ❌ **Cultural clothing**: Traditional non-Western garments (kimono, sari, dashiki) may be generically labeled
- ❌ **Accessories**: Small items like jewelry are hard to categorize from photos

**Outfit Recommender Limitations**:
- ❌ **Sparse wardrobes**: <10 items leads to repetitive or incomplete suggestions
- ❌ **Niche occasions**: "Music festival in the desert" gets generic "casual" suggestions
- ❌ **Personal fit**: Doesn't know body type, comfort level, or cultural context
- ❌ **Style consistency**: May suggest items that clash with user's stated style preferences
- ❌ **Color blindness**: Occasional questionable color combos (lime green + hot pink)
- ❌ **Trend awareness**: No awareness of current fashion trends (using 2024 training cutoff)

### Known Failure Modes

1. **Hallucination**: Claude may confidently state incorrect information
   - Example: "This floral pattern is perfect for fall" when user uploaded a winter coat
   - Mitigation: Structured JSON output reduces hallucination risk

2. **Over-reliance on context**: AI may make assumptions based on photo background
   - Example: Casual shirt on bed may be tagged "loungewear" instead of "casual"
   - Mitigation: Prompt emphasizes focusing on the garment only

3. **Cultural bias**: Training data likely skewed toward Western fashion
   - Example: May not recognize traditional South Asian or African formal wear
   - Impact: Users with diverse wardrobes may need manual corrections

4. **Weather over-optimization**: AI may overweight weather in suggestions
   - Example: Suggesting raincoat for 10% chance of rain
   - Mitigation: Prompt balances weather with style preferences

5. **Small wardrobe problem**: Can't create formal outfit if user has no formal clothes
   - Mitigation: Future feature could suggest shopping recommendations

### Bias Considerations

**Demographic bias**:
- User preferences include gender and age to tailor suggestions appropriately
- Risk: AI may reinforce gender stereotypes (e.g., suggesting dresses only for women)
- Mitigation: Preferences are self-reported; users control their style identity

**Geographic bias**:
- Weather data assumes user is in location with clear seasons
- Risk: Tropical or polar climates may get less relevant suggestions
- Mitigation: Weather API provides actual conditions; AI adapts

**Socioeconomic bias**:
- AI assumes user wants to maximize existing wardrobe (sustainability focus)
- Risk: May not reflect aspirational styling or luxury fashion norms
- Benefit: Aligns with product vision (style with what you have)

---

## Improvement Path

### What concrete steps were taken to improve performance?

**Iteration 1: Initial Prompt (Early Development)**
- **Issue**: Claude Vision returned markdown-wrapped JSON (```json ... ```)
- **Fix**: Added JSON parsing logic to strip markdown code blocks
- **Impact**: 100% of requests now parse successfully (was failing ~30%)

**Iteration 2: Category Consistency**
- **Issue**: Inconsistent category names ("shirt" vs "top" vs "blouse")
- **Fix**: Updated prompt with explicit category list and examples
- **Impact**: Category accuracy improved from ~80% to ~95%

**Iteration 3: Color Specificity**
- **Issue**: Colors too generic ("blue" for navy, royal blue, teal)
- **Fix**: Prompt now asks for specific color names ("navy blue", "royal blue")
- **Impact**: Color accuracy improved from ~75% to ~90%

**Iteration 4: User Preference Integration (Completed March 11, 2026)**
- **Issue**: Outfit suggestions didn't reflect user's stated style preferences
- **Fix**: Updated `suggest-outfits` Edge Function to include user preferences (gender, age, style, color palettes) in prompt
- **Impact**: Preference alignment improved from ~60% to ~75% (informal testing)

**Iteration 5: Weather Context Enhancement**
- **Issue**: AI mentioned weather but didn't always adapt suggestions
- **Fix**: Prompt explicitly asks to consider layering, fabrics, and coverage based on temperature
- **Impact**: Weather appropriateness improved from ~75% to ~90%

### What would we prioritize next?

**Short-term improvements** (Next 2-4 weeks):

1. **Feedback Loop Integration**
   - **Problem**: No way to learn from user preferences (favorites, rejections)
   - **Solution**: Track which outfits users save/favorite and which they skip
   - **Expected Impact**: Could fine-tune suggestions based on implicit feedback
   - **Implementation**: Add analytics table, retrain prompts monthly with common patterns

2. **Few-Shot Example Addition**
   - **Problem**: Occasional color coordination mistakes
   - **Solution**: Add 3-5 example outfits to prompt showing good color combos
   - **Expected Impact**: Reduce bad color suggestions by ~50%
   - **Implementation**: Craft few-shot examples in prompt, A/B test

3. **Wardrobe Gap Analysis**
   - **Problem**: Can't create formal outfits if user has no formal clothes
   - **Solution**: Detect missing categories and suggest shopping
   - **Expected Impact**: Better user experience, potential revenue (affiliate links)
   - **Implementation**: Simple rule-based logic (if occasion=formal && no formal items → suggest shopping)

**Long-term improvements** (Next 3-6 months):

4. **Fine-tuning or Specialized Model**
   - **Problem**: Generic LLM isn't optimized for fashion
   - **Solution**: Fine-tune on fashion dataset or use fashion-specific embedding model
   - **Expected Impact**: Better style understanding, trend awareness
   - **Cost**: ~$500-1000 for fine-tuning, ongoing inference costs
   - **ROI**: Depends on user growth and retention impact

5. **Multi-modal Outfit Visualization**
   - **Problem**: Text suggestions don't show how outfit looks together
   - **Solution**: Generate composite image or use image generation model
   - **Expected Impact**: Users can visualize before committing
   - **Technology**: DALL-E 3 or Midjourney API for outfit mockups

6. **Personal Style Embeddings**
   - **Problem**: Binary "yes/no" on favorites doesn't capture nuance
   - **Solution**: Build user style embeddings from favorited outfits, use similarity search
   - **Expected Impact**: Hyper-personalized suggestions aligned with user's unique taste
   - **Technology**: OpenAI embeddings or custom fashion encoder

### Measurable Success Criteria

| Metric | Current | Target (3 months) |
|--------|---------|-------------------|
| Clothing category accuracy | 95% | 98% |
| User edits per analyzed item | 15% | <10% |
| Outfit suggestions saved | 25% | 40% |
| Repeat usage (return within 7 days) | 60% | 75% |
| Average time to outfit decision | 5 min | 2 min |

---

## Ethical Considerations

### Transparency
- Users are informed that AI analyzes their photos and generates suggestions
- "AI Stylist" badge clearly visible on relevant features
- Users can manually correct AI categorizations

### Privacy
- All photos stored securely in user's private storage bucket
- No data sharing with third parties
- AI only accesses photos user explicitly uploads
- User can delete wardrobe items and data at any time

### Environmental Impact
- Product encourages wearing existing clothes (sustainability)
- Reduces fast fashion consumption by maximizing wardrobe utility
- Aligns with conscious consumerism values

### Accessibility
- Free tier planned to ensure access regardless of income
- Mobile-first design for global smartphone access
- Future: Multilingual support for non-English speakers

---

## Responsible AI Deployment

**Monitoring**:
- Log all AI API calls with input/output for debugging
- Track error rates and failure modes
- User feedback mechanism (favorites, manual corrections)

**Human-in-the-Loop**:
- All AI suggestions are optional; user always has final decision
- Manual editing available for all AI-generated tags
- No automated actions (e.g., deleting items) without user confirmation

**Iterative Improvement**:
- Monthly review of AI performance metrics
- User feedback drives prompt refinement
- A/B testing new prompts before full rollout

**Graceful Degradation**:
- If AI API fails, user can still upload photos with manual categorization
- Cache previous outfit suggestions to show during API downtime
- Clear error messages when AI is unavailable

---

## References & Resources

- **Anthropic Claude Documentation**: https://docs.anthropic.com/
- **Model Card Examples**: [Google DeepMind](https://deepmind.google/), [HuggingFace](https://huggingface.co/docs/hub/model-cards)
- **Fashion AI Research**: "Fashion++: Minimal Edits for Outfit Improvement" (2019), "Learning Fashion Compatibility" (2017)
- **OpenWeatherMap API**: https://openweathermap.org/api

---

**Model Card Prepared By**: Northwestern Kellogg MBAi 448 Team
**Last Updated**: March 11, 2026
**Next Review**: June 11, 2026 (quarterly review cycle)
