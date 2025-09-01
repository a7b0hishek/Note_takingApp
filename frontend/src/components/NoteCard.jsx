import React from 'react';
import { Link } from 'react-router-dom';
import { dateFormatter } from '../utils/dateFormatter';
import { helpers } from '../utils/helpers';

const NoteCard = ({ note, onDelete }) => {
  const {
    _id,
    title,
    content,
    tags = [],
    createdAt,
    updatedAt,
    isPinned = false,
    isArchived = false,
  } = note;

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(_id);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 ${isPinned ? 'ring-2 ring-yellow-400' : ''}`}>
      {/* Card Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {title || 'Untitled Note'}
          </h3>
          <div className="flex items-center space-x-2 ml-2">
            {isPinned && (
              <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3z" clipRule="evenodd" />
              </svg>
            )}
            {isArchived && (
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8l6 6 6-6" />
              </svg>
            )}
          </div>
        </div>

        {/* Content Preview */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {helpers.truncateText(content, 150) || 'No content'}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                +{tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Timestamps */}
        <div className="text-xs text-gray-500 mb-4">
          <div>Created: {dateFormatter.formatDate(createdAt)}</div>
          {updatedAt !== createdAt && (
            <div>Updated: {dateFormatter.getRelativeTime(updatedAt)}</div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Link
            to={`/edit-note/${_id}`}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors duration-200"
          >
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </Link>

          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // TODO: Implement toggle pin functionality
              }}
              className="inline-flex items-center p-1.5 border border-transparent rounded text-gray-400 hover:text-yellow-500 transition-colors duration-200"
              title={isPinned ? 'Unpin note' : 'Pin note'}
            >
              <svg className="w-4 h-4" fill={isPinned ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>

            <button
              onClick={handleDelete}
              className="inline-flex items-center p-1.5 border border-transparent rounded text-gray-400 hover:text-red-500 transition-colors duration-200"
              title="Delete note"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
