import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createNote } from '../redux/noteSlice';
import NoteForm from '../components/NoteForm';
import Loader from '../components/Loader';

const AddNote = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.notes);

  const handleSubmit = async (noteData) => {
    try {
      await dispatch(createNote(noteData)).unwrap();
      navigate('/notes');
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Note</h1>
        <p className="mt-2 text-gray-600">
          Write down your thoughts, ideas, or anything you want to remember.
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center min-h-96">
          <Loader />
        </div>
      ) : (
        <NoteForm
          onSubmit={handleSubmit}
          onCancel={() => navigate('/notes')}
          submitText="Create Note"
        />
      )}
    </div>
  );
};

export default AddNote;
