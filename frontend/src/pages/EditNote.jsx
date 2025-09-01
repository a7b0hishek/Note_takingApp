import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchNoteById, updateNote, clearCurrentNote } from '../redux/noteSlice';
import NoteForm from '../components/NoteForm';
import Loader from '../components/Loader';

const EditNote = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentNote, loading, error } = useSelector((state) => state.notes);

  useEffect(() => {
    if (id) {
      dispatch(fetchNoteById(id));
    }

    return () => {
      dispatch(clearCurrentNote());
    };
  }, [dispatch, id]);

  const handleSubmit = async (noteData) => {
    try {
      await dispatch(updateNote({ noteId: id, noteData })).unwrap();
      navigate('/notes');
    } catch (error) {
      console.error('Failed to update note:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  if (!currentNote) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-600 px-4 py-3 rounded-md">
          Note not found or still loading...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Note</h1>
        <p className="mt-2 text-gray-600">
          Make changes to your note and save them.
        </p>
      </div>

      <NoteForm
        initialData={currentNote}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/notes')}
        submitText="Update Note"
      />
    </div>
  );
};

export default EditNote;
