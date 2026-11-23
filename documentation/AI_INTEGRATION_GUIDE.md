# Four Seasons Studio — AI Integration & Architecture Guide

---

## 1. Overview of the Creative Generation Pipeline

The AI engine in **Four Seasons Studio** allows clients and event designers to select combinations of physical inventory items (e.g., mandaps, stages, bar counters, jhoolas, photobooths) and render photorealistic 4K concept imagery and cinematic videos before physical event setup.

---

## 2. Asynchronous Execution Lifecycle

AI generation tasks can take between 3 and 60 seconds depending on provider latency. To avoid blocking HTTP connections and client timeouts, the system uses an asynchronous job lifecycle:

```
[Client Submits Job]
         |
         v
[POST /api/ai/generate] ──> Saves record to `ai_generations` with status: PENDING
         |
         v
[Background Worker Engine]
  - Updates status to PROCESSING
  - Resolves selected item reference images & specifications
  - Formulates contextual prompts (preserving physical inventory geometry & textures)
  - Dispatches to Active AI Provider (Midjourney / Runway / DALL-E / ModularMock)
         |
         v
[Completed or Failed] ──> Updates record to COMPLETED (or FAILED) with outputUrl
         |
         v
[Client Polling] ──> [GET /api/ai/status/:id] returns final preview URL & metrics
```

---

## 3. Pluggable AI Provider Architecture

The AI module is built around a clean interface `AiProviderInterface`:

```typescript
export interface AiProviderInterface {
  generateImage(prompt: string, options: GenerationOptions): Promise<GenerationResult>;
  generateVideo(prompt: string, options: GenerationOptions): Promise<GenerationResult>;
}
```

### Available Providers:
1. **`ModularMockProvider` (Active Default / Development Mode)**:
   - Preserves actual client catalog imagery and compositions according to selected inventory IDs (e.g. Wave Stage, Moorish Arch, Versace Bar, Jhoola).
   - Simulates realistic generation latency (2–4 seconds) and status progression.
   - Transparently labels output provider metadata: `ModularMockProvider (Preserving Real Inventory Specs)`.
2. **`MidjourneyProvider` (Production Ready)**:
   - Dispatches via Midjourney API / Imagine endpoint with image weighting (`--iw 2.0`) to retain physical inventory fidelity.
3. **`OpenAiDalle3Provider` (Production Ready)**:
   - Uses OpenAI DALL-E 3 API with detailed system prompt engineering.
4. **`RunwayGen2Provider` (Video Generation)**:
   - Dispatches image-to-video jobs based on the generated high-resolution still image.

---

## 4. Switching AI Providers

To switch the active AI provider, administrators can change the system setting via the Admin Dashboard or via the API:

```http
PUT /api/settings/ai_active_provider
Content-Type: application/json

{
  "value": "midjourney"
}
```

Or configure environment variables in `backend/.env`:
```env
AI_ACTIVE_PROVIDER=midjourney
MIDJOURNEY_API_KEY=your_key_here
RUNWAY_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
```

