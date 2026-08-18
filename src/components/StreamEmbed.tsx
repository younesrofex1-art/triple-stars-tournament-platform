import React from 'react';
import { Radio, ExternalLink, Tv } from 'lucide-react';

interface StreamEmbedProps {
  embedUrl?: string | null;
  title?: string | null;
  streamUrl?: string | null;
}

export const StreamEmbed: React.FC<StreamEmbedProps> = ({
  embedUrl,
  title = 'Triple Stars Main Stage',
  streamUrl,
}) => {
  if (!embedUrl && !streamUrl) {
    return (
      <div className="bg-surface-200 border border-border rounded-2xl p-8 text-center space-y-2">
        <Tv className="w-10 h-10 text-gray-500 mx-auto" />
        <h4 className="text-sm font-bold text-gray-300">No Stage Stream Attached</h4>
        <p className="text-xs text-gray-500">
          When the administrator launches the YouTube or Twitch arena broadcast, it will stream here in real time.
        </p>
      </div>
    );
  }

  const finalEmbedUrl = embedUrl || streamUrl?.replace('watch?v=', 'embed/');

  return (
    <div className="bg-surface-200 border border-border rounded-2xl overflow-hidden shadow-card">
      {/* Stream Header Bar */}
      <div className="bg-surface-300 px-5 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center space-x-3 truncate pr-2">
          <span className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-800 text-[10px] font-bold uppercase tracking-wider font-mono flex-shrink-0">
            <Radio className="w-3 h-3 text-rose-500 animate-pulse" />
            <span>LIVE STAGE</span>
          </span>
          <h3 className="font-display text-base font-bold text-white tracking-wide truncate">
            {title || 'Triple Stars Main Stage'}
          </h3>
        </div>

        {streamUrl && (
          <a
            href={streamUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-xs text-brand-orange hover:text-white transition-colors flex-shrink-0"
          >
            <span>External Stream</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* Video Iframe */}
      <div className="relative aspect-video w-full bg-black">
        {finalEmbedUrl ? (
          <iframe
            src={finalEmbedUrl}
            title={title || 'Stream Player'}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 text-xs">
            Unable to render stream player.
          </div>
        )}
      </div>
    </div>
  );
};
